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
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function GET(request: Request) {
  try {
    const token = getAuthToken(request);

    const response = await fetch(`${BACKEND_URL}/api/price-pos/lists/promoters`, {
      method: 'GET',
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching unique promoters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unique promoters' },
      { status: 500 }
    );
  }
}
