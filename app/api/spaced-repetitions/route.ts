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
    const taskId = searchParams.get('taskId');

    let query = `/rest/v1/spaced_repetitions?user_id=eq.${userId}`;
    if (taskId) {
      query += `&task_id=eq.${taskId}`;
    }

    const response = await fetch(`${SUPABASE_URL}${query}`, {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch spaced repetitions');
    }

    const schedules = await response.json();
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('[v0] Get spaced repetitions error:', error);
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

    const schedule = {
      user_id: userId,
      task_id: data.taskId,
      original_study_date: data.originalStudyDate,
      review_1_date: data.review1Date,
      review_3_date: data.review3Date,
      review_7_date: data.review7Date,
      review_30_date: data.review30Date,
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/spaced_repetitions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      throw new Error('Failed to create spaced repetition schedule');
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('[v0] Create spaced repetition error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
