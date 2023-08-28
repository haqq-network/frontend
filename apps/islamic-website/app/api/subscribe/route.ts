import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '[::1]';
  const { email } = await request.json();

  return NextResponse.json(
    {
      ip,
      email,
    },
    { status: 200 },
  );
}
