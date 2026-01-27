import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Call the backend's /api/shops/login endpoint
    const response = await fetch(`${BACKEND_URL}/api/shops/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Invalid credentials' }));
      return NextResponse.json(
        { error: error.detail || 'Invalid credentials' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // The response should contain { access_token: "...", token_type: "bearer", ... }
    return NextResponse.json({
      token: data.access_token,
      token_type: data.token_type || 'bearer',
      userId: username,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
