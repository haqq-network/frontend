import { NextRequest, NextResponse } from 'next/server';
import { MEETUP_ID } from '../constants';

const FALCONER_ENDPOINT = process.env['FALCONER_ENDPOINT'];

interface EventVerifyRequest {
  meetup_id: string;
  ticket: string;
}

interface EventSignupResponse {
  status: number;
  error_type?: string;
  error_description?: string;
}

interface VerifyRequest {
  ticket: string;
}

export async function POST(request: NextRequest) {
  const {
    ticket,
  }: VerifyRequest = await request.json();
  const VerifyRequest: EventVerifyRequest = {
    meetup_id: MEETUP_ID,
    ticket: ticket
  };

  console.log({ VerifyRequest });
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
  if (signupResponseJson.error_description) {
    return NextResponse.json<{ error: string, result: EventSignupResponse }>(
      {
        error: signupResponseJson.error_description,
        result: signupResponseJson
      },
      {
        status: 400,
      },
    );
  }

  return NextResponse.json<{ result: EventSignupResponse }>(
    {
      result: signupResponseJson
    },
    {
      status: 200,
    },
  );
}
