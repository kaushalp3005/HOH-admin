import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Helper function to forward auth header
function getForwardedHeaders(request: Request, includeContentType = false): HeadersInit {
  const authHeader = request.headers.get('Authorization');
  const headers: HeadersInit = {
    'accept': 'application/json',
  };
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(`${BACKEND_URL}/api/pos-entries/${id}`, {
      method: 'GET',
      headers: getForwardedHeaders(request),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching POS entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch POS entry' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;

    const response = await fetch(`${BACKEND_URL}/api/pos-entries/${id}`, {
      method: 'PUT',
      headers: getForwardedHeaders(request, true),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating POS entry:', error);
    return NextResponse.json(
      { error: 'Failed to update POS entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('Authorization');
    const headers: HeadersInit = {
      'accept': '*/*',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    const response = await fetch(`${BACKEND_URL}/api/pos-entries/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok && response.status !== 204) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(error, { status: response.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting POS entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete POS entry' },
      { status: 500 }
    );
  }
}
