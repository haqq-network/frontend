import { FALCONER_ENDPOINT } from '../constants';
import { FalconerChainStatsRequestInit } from '../get-chain-stats/get-chain-stats';

export async function getIslamicIndexPageData(
  options: Partial<FalconerChainStatsRequestInit>,
  locale?: string,
) {
  const requestUrl = new URL('/islamic/home', FALCONER_ENDPOINT);
  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ locale }),
    ...options,
  });

  if (!response.ok) {
    throw new Error('chain stats fetch failed');
  }

  const responseJson = await response.json();

  return responseJson;
}
