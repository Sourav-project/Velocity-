import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    if (checkResponse.ok) {
      const existingUsers = await checkResponse.json();
      if (existingUsers && existingUsers.length > 0) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const passwordHash = hashPassword(password);

    // Create user in database
    const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        email,
        password_hash: passwordHash,
        full_name: fullName,
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      console.error('[v0] Create user error:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    const userData = await createResponse.json();
    const userId = Array.isArray(userData) ? userData[0]?.id : userData.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Create a session token (simple JWT-like token with user ID and email)
    const sessionToken = crypto.randomBytes(32).toString('hex');

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Store session mapping in a simple way (user_id:token)
    cookieStore.set('user_id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(
      {
        user: {
          id: userId,
          email,
          full_name: fullName,
        },
        message: 'Signup successful',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
