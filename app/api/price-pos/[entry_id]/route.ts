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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ entry_id: string }> }
) {
  try {
    const token = getAuthToken(request);
    const { entry_id } = await params;

    const response = await fetch(`${BACKEND_URL}/api/price-pos/${entry_id}`, {
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
    console.error('Error fetching price POS mapping:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price POS mapping' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ entry_id: string }> }
) {
  try {
    const token = getAuthToken(request);
    const body = await request.json();
    const { entry_id } = await params;

    const response = await fetch(`${BACKEND_URL}/api/price-pos/${entry_id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating price POS mapping:', error);
    return NextResponse.json(
      { error: 'Failed to update price POS mapping' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ entry_id: string }> }
) {
  try {
    const token = getAuthToken(request);
    const { entry_id } = await params;

    const response = await fetch(`${BACKEND_URL}/api/price-pos/${entry_id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(token),
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting price POS mapping:', error);
    return NextResponse.json(
      { error: 'Failed to delete price POS mapping' },
      { status: 500 }
    );
  }
}
