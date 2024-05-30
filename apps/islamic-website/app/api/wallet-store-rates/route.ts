import gplay from 'google-play-scraper';
import { NextResponse } from 'next/server';
import store from '@haqq/app-store-scraper';

export async function GET() {
  const [appStoreResponse, googlePlayResponse] = await Promise.all([
    store.app({ id: 6443843352 }),
    gplay.app({ appId: 'com.haqq.wallet' }),
  ]);

  return NextResponse.json<{
    appStore: number;
    googlePlay: number;
  }>(
    {
      appStore: appStoreResponse.score,
      googlePlay: googlePlayResponse.score,
    },
    {
      status: 200,
    },
  );
}
