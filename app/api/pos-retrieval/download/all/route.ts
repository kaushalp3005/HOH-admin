import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeName = searchParams.get('store_name');

    const params = new URLSearchParams();

    if (storeName) params.append('store_name', storeName);

    const queryString = params.toString();
    const backendUrl = queryString
      ? `${BACKEND_URL}/api/pos-retrieval/download/all?${queryString}`
      : `${BACKEND_URL}/api/pos-retrieval/download/all`;
    console.log('Fetching from backend:', backendUrl);

    // Forward the Authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    const headers: HeadersInit = {
      'accept': 'application/json',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error downloading all POS data:', error);
    return NextResponse.json(
      { error: 'Failed to download all POS data' },
      { status: 500 }
    );
  }
}
