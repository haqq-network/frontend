import { FALCONER_ENDPOINT } from '../../../constants';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface FeedbackRequest {
  name: string;
  email: string;
  message: string;
  ip: string;
  domain: 'haqq.network' | 'islamiccoin.net';
  captcha_token: string;
}

interface SubscribeResponse {
  status: number;
  error?: string;
}

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '[::1]';
  const { email, token, name, message }: Record<string, string> =
    await request.json();
  const feedbackRequest: FeedbackRequest = {
    domain: 'haqq.network',
    ip,
    email,
    name,
    message,
    captcha_token: token,
  };
  console.log({ feedbackRequest });

  const subscribeUrl = new URL('/feedback/send', FALCONER_ENDPOINT);
  const subscribeResponse = await fetch(subscribeUrl.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedbackRequest),
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
