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

export async function GET(request: Request) {
  try {
    const token = getAuthToken(request);
    const { searchParams } = new URL(request.url);

    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });

    const response = await fetch(`${BACKEND_URL}/api/price-pos/?${params.toString()}`, {
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
    console.error('Error fetching price POS mappings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price POS mappings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = getAuthToken(request);
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/price-pos/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating price POS mappings:', error);
    return NextResponse.json(
      { error: 'Failed to create price POS mappings' },
      { status: 500 }
    );
  }
}
