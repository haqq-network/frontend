import { FALCONER_ENDPOINT } from '../../../constants';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface SubscribeRequest {
  email: string;
  ip: string;
  domain: string;
  captcha_token: string;
}

interface SubscribeResponse {
  status: number;
  error?: string;
}

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '[::1]';
  const { email, token }: Record<string, string> = await request.json();
  const subscribeRequest: SubscribeRequest = {
    domain: 'haqq.network',
    ip,
    email,
    captcha_token: token,
  };
  const subscribeUrl = new URL('/email/subscribe', FALCONER_ENDPOINT);
  const subscribeResponse = await fetch(subscribeUrl.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscribeRequest),
  });
  const subscribeResponseJson: SubscribeResponse =
    await subscribeResponse.json();

  if (subscribeResponseJson.error) {
    return NextResponse.json<{ error: string }>(
      {
        error: subscribeResponseJson.error,
      },
      {
        status: 400,
      },
    );
  }

  return NextResponse.json<{ message: string }>(
    {
      message: 'Subscription successful',
    },
    {
      status: 200,
    },
  );
}
