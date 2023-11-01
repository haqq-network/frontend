import { FALCONER_ENDPOINT } from '../constants';
import { FalconerChainStatsRequestInit } from '../get-chain-stats/get-chain-stats';

type NewsType = 'press' | 'events';

export interface FalconerNewsPost {
  image: {
    src: string;
    width: number;
    height: number;
  } | null;
  title: string;
  description: string;
  date: string;
  source: string;
  content_type: NewsType;
  url: string;
}

export async function getNewsData(
  options: Partial<FalconerChainStatsRequestInit>,
  limit?: number,
) {
  const requestUrl = new URL('/islamic/news', FALCONER_ENDPOINT);
  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ limit }),
    ...options,
  });

  if (!response.ok) {
    throw new Error('chain stats fetch failed');
  }

  const responseJson = await response.json();
  console.log({ responseJson });

  return responseJson as FalconerNewsPost[];
}
