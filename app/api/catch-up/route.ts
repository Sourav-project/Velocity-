import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function getSessionUserId(request: NextRequest): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  const userId = cookieStore.get('user_id')?.value;

  if (!sessionToken || !userId) {
    return null;
  }

  return userId;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { studyPeriodId } = await request.json();

    // Get all tasks
    const tasksResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/tasks?study_period_id=eq.${studyPeriodId}&user_id=eq.${userId}`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!tasksResponse.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const allTasks = await tasksResponse.json();

    // Get study period info for exam date
    const periodResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/study_periods?id=eq.${studyPeriodId}`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!periodResponse.ok) {
      throw new Error('Failed to fetch study period');
    }

    const periods = await periodResponse.json();
    const period = periods[0];

    // Identify overdue tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = allTasks.filter((task: any) => {
      const taskDueDate = new Date(task.due_date);
      taskDueDate.setHours(0, 0, 0, 0);
      return taskDueDate < today && task.status !== 'completed';
    });

    // Calculate priority scores
    const withPriority = overdueTasks.map((task: any) => {
      const daysOverdue = Math.ceil(
        (today.getTime() - new Date(task.due_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      const priority = (task.difficulty * task.importance) / Math.max(1, daysOverdue);
      return { ...task, priorityScore: priority };
    });

    // Sort by priority
    withPriority.sort((a: any, b: any) => b.priorityScore - a.priorityScore);

    return NextResponse.json({
      overdueTasks: withPriority,
      totalOverdue: overdueTasks.length,
      examDate: period.exam_date,
      message: `Found ${overdueTasks.length} overdue task(s)`,
    });
  } catch (error) {
    console.error('[v0] Catch-up API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
