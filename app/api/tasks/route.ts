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

export async function GET(request: NextRequest) {
  try {
    const userId = await getSessionUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studyPeriodId = searchParams.get('studyPeriodId');

    let query = `/rest/v1/tasks?user_id=eq.${userId}`;
    if (studyPeriodId) {
      query += `&study_period_id=eq.${studyPeriodId}`;
    }
    query += '&order=due_date.asc';

    const response = await fetch(`${SUPABASE_URL}${query}`, {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('[v0] Get tasks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const taskData = {
      user_id: userId,
      study_period_id: data.studyPeriodId,
      title: data.title,
      description: data.description,
      subject: data.subject,
      difficulty: data.difficulty || 5,
      importance: data.importance || 5,
      estimated_time: data.estimatedTime,
      due_date: data.dueDate,
      intensity: data.intensity || 'medium',
      status: 'pending',
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create task');
    }

    const task = await response.json();
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('[v0] Create task error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
