import store from 'app-store-scraper';
import gplay from 'google-play-scraper';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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
