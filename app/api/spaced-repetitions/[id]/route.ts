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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getSessionUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/spaced_repetitions?id=eq.${id}&user_id=eq.${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update spaced repetition');
    }

    return NextResponse.json({ message: 'Updated successfully' });
  } catch (error) {
    console.error('[v0] Update spaced repetition error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
