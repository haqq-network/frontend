import { NextRequest, NextResponse } from 'next/server';

const WAITLIST_API_URL =
  process.env.BURN_WAITLIST_API_URL || 'https://waitlist.vorobevsa.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Forward query parameters to waitlist API
    const params = new URLSearchParams();
    if (searchParams.get('address')) {
      params.append('address', searchParams.get('address')!);
    }
    if (searchParams.get('status')) {
      params.append('status', searchParams.get('status')!);
    }
    if (searchParams.get('page')) {
      params.append('page', searchParams.get('page')!);
    }
    if (searchParams.get('pageSize')) {
      params.append('pageSize', searchParams.get('pageSize')!);
    }

    const queryString = params.toString();
    const url = queryString
      ? `${WAITLIST_API_URL}/api/v1/applications?${queryString}`
      : `${WAITLIST_API_URL}/api/v1/applications`;

    // Forward request to waitlist API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || `API error: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in waitlist applications API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
