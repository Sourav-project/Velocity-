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

    const data = await request.json();

    const logEntry = {
      user_id: userId,
      task_id: data.task_id,
      original_due_date: data.original_due_date,
      new_due_date: data.new_due_date,
      priority_score: data.priority_score,
      reason: data.reason,
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/redistribution_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify(logEntry),
    });

    if (!response.ok) {
      throw new Error('Failed to log redistribution');
    }

    return NextResponse.json({ message: 'Redistribution logged' }, { status: 201 });
  } catch (error) {
    console.error('[v0] Redistribution log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
