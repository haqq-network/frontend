import { ipAddress } from '@vercel/edge';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { FALCONER_ENDPOINT } from '../../../constants';

interface SubscribeRequest {
  email: string;
  ip: string;
  domain: 'islamiccoin.net';
  captcha_token: string;
}

interface SubscribeResponse {
  status: number;
  error?: string;
}

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const ip = ipAddress(request) || 'unknown';
  const { email, token }: Record<string, string> = await request.json();
  const subscribeRequest: SubscribeRequest = {
    domain: 'islamiccoin.net',
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
