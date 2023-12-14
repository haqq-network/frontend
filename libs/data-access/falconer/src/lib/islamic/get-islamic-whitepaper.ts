import { FALCONER_ENDPOINT } from '../../constants';
import { FalconerRequestInit } from '../../types';

export async function getIslamicWhitepaper(
  options: Partial<FalconerRequestInit>,
  locale: string,
) {
  const requestUrl = new URL('/islamic/wp', FALCONER_ENDPOINT);
  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ locale }),
    ...options,
  });

  if (!response.ok) {
    throw new Error('Whitepaper fetch failed');
  }

  const responseJson = await response.json();

  return responseJson.wp as string;
}
