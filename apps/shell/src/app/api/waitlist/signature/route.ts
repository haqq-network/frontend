import { NextRequest, NextResponse } from 'next/server';

const WAITLIST_API_URL =
  process.env.BURN_WAITLIST_API_URL || 'https://waitlist.vorobevsa.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.user || !body.amount || body.source === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: user, amount, source' },
        { status: 400 },
      );
    }

    // Forward request to waitlist API
    const response = await fetch(
      `${WAITLIST_API_URL}/api/v1/signer/signature`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

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
    console.error('Error in waitlist signature API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
