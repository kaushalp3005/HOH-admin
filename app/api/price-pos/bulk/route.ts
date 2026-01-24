import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

function getAuthToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

function getAuthHeaders(token: string | null): HeadersInit {
  return {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function POST(request: Request) {
  try {
    const token = getAuthToken(request);
    const body = await request.json();

    // The spec shows bulk endpoint accepts { entries: [...] }
    // But the main POST endpoint accepts array directly
    // This endpoint wraps it in entries object, then sends array to backend
    const entries = body.entries || body;

    const response = await fetch(`${BACKEND_URL}/api/price-pos/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(entries),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error bulk creating price POS mappings:', error);
    return NextResponse.json(
      { error: 'Failed to bulk create price POS mappings' },
      { status: 500 }
    );
  }
}
