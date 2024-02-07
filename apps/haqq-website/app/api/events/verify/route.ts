import { NextRequest, NextResponse } from 'next/server';
import { FALCONER_ENDPOINT } from '../../../../constants';
import { MEETUP_ID } from '../constants';

interface EventVerifyRequest {
  meetup_id: string;
  ticket: string;
}

interface EventSignupResponse {
  success: boolean;
}

interface VerifyRequest {
  ticket: string;
}

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const { ticket }: VerifyRequest = await request.json();
  const VerifyRequest: EventVerifyRequest = {
    meetup_id: MEETUP_ID,
    ticket: ticket,
  };

  const signupUrl = new URL('/meetup/ticket/verify', FALCONER_ENDPOINT);
  const signupResponse = await fetch(signupUrl.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(VerifyRequest),
  });
  const signupResponseJson: EventSignupResponse = await signupResponse.json();

  console.log({ signupResponseJson });

  return NextResponse.json<{ result: EventSignupResponse }>(
    {
      result: signupResponseJson,
    },
    {
      status: 200,
    },
  );
}
