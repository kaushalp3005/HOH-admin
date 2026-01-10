import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');

    const backendUrl = `${BACKEND_URL}/api/products/stores/`;
    console.log('Fetching stores from:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      cache: 'no-store',
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      console.error('Backend error:', error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { detail: 'Failed to fetch stores: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
