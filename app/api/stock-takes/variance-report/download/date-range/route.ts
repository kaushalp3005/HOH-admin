import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Both start_date and end_date parameters are required (format: YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });

    const backendUrl = `${BACKEND_URL}/api/stock-takes/variance-report/download/date-range?${params.toString()}`;
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
    console.error('Error downloading stock variance report by date range:', error);
    return NextResponse.json(
      { error: 'Failed to download stock variance report by date range' },
      { status: 500 }
    );
  }
}
