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

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/user_preferences?user_id=eq.${userId}`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch preferences');
    }

    const preferences = await response.json();
    return NextResponse.json(preferences[0] || {});
  } catch (error) {
    console.error('[v0] Get preferences error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
