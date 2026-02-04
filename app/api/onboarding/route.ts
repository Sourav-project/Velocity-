import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;
    const userId = cookieStore.get('user_id')?.value;

    if (!sessionToken || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Create study period
    const studyPeriodResponse = await fetch(`${SUPABASE_URL}/rest/v1/study_periods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({
        user_id: userId,
        title: data.courseTitle,
        description: data.courseDescription,
        exam_date: data.examDate,
        status: 'active',
      }),
    });

    if (!studyPeriodResponse.ok) {
      console.error('[v0] Study period creation failed');
      return NextResponse.json(
        { error: 'Failed to create study period' },
        { status: 500 }
      );
    }

    // Create user preferences
    const preferencesResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({
        user_id: userId,
        peak_hours_start: data.peakHoursStart,
        peak_hours_end: data.peakHoursEnd,
        energy_slump_start: data.energySlumpStart,
        energy_slump_end: data.energySlumpEnd,
        daily_study_hours: data.dailyStudyHours,
        preferred_session_length: data.preferredSessionLength,
      }),
    });

    if (!preferencesResponse.ok) {
      console.error('[v0] Preferences creation failed');
      return NextResponse.json(
        { error: 'Failed to create preferences' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Onboarding completed successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Onboarding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
