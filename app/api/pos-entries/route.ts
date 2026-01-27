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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('page_size') || '10';
    const storeName = searchParams.get('store_name');
    const promoterName = searchParams.get('promoter_name');

    const params = new URLSearchParams({
      page,
      page_size: pageSize,
    });

    if (storeName) params.append('store_name', storeName);
    if (promoterName) params.append('promoter_name', promoterName);

    const response = await fetch(`${BACKEND_URL}/api/pos-entries?${params.toString()}`, {
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
    console.error('Error fetching POS entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch POS entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/pos-entries`, {
      method: 'POST',
      headers: getForwardedHeaders(request, true),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating POS entry:', error);
    return NextResponse.json(
      { error: 'Failed to create POS entry' },
      { status: 500 }
    );
  }
}
