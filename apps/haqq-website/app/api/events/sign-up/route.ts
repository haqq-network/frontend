import { NextRequest, NextResponse } from 'next/server';

const FALCONER_ENDPOINT = process.env['FALCONER_ENDPOINT'];

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
  error?: string;
}

const meetupId = '271f1a46-ba4e-4a4f-a850-41eda5f3d056';

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
    meetup_id: meetupId,
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

  if (signupResponseJson.error) {
    return NextResponse.json<{ error: string }>(
      {
        error: signupResponseJson.error,
      },
      {
        status: 400,
      },
    );
  }

  return NextResponse.json<{ message: string }>(
    {
      message: 'You successfully registered to event',
    },
    {
      status: 200,
    },
  );
}
