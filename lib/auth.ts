import { cookies } from 'next/headers';

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
}

export interface AuthResponse {
  user: AuthUser;
  message: string;
}

// Client-side auth helper for signup
export async function signUp(email: string, password: string, fullName: string): Promise<AuthResponse> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      fullName,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Signup failed');
  }

  return response.json();
}

// Client-side auth helper for signin
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
}

// Get current session
export async function getSession(): Promise<AuthUser | null> {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

// Sign out
export async function signOut(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch {
    // Silently fail
  }
}
