import { NextRequest, NextResponse } from 'next/server';
import { FALCONER_ENDPOINT, MEETUP_ID } from '../constants';

interface EventSignupRequest {
  fullname: string;
  email: string;
  company?: string;
  job_title?: string;
  meetup_id: string;
  captcha_token: string;
  signature: string;
  ip: string;
}

interface EventSignupResponse {
  status: number;
  error_type?: string;
  error_description?: string;
}

interface SignupRequest {
  fullname: string;
  email: string;
  company?: string;
  position?: string;
  // token: string;
  signature: string;
}

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '[::1]';
  const {
    fullname,
    email,
    company,
    position,
    // token,
    signature,
  }: SignupRequest = await request.json();
  const signupRequest: EventSignupRequest = {
    ip,
    meetup_id: MEETUP_ID,
    fullname: fullname,
    email,
    company: company,
    job_title: position,
    captcha_token: 'token',
    signature,
  };

  console.log({ signupRequest });
  const signupUrl = new URL('/meetup/ticket/generate', FALCONER_ENDPOINT);
  const signupResponse = await fetch(signupUrl.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signupRequest),
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

  return NextResponse.json<{ message: string, result: EventSignupResponse }>(
    {
      message: 'You successfully registered to event',
      result: signupResponseJson
    },
    {
      status: 200,
    },
  );
}
