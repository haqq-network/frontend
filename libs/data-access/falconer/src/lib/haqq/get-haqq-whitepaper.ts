import { FALCONER_ENDPOINT } from '../../constants';
import { FalconerRequestInit } from '../../types';

export async function getHaqqWhitepaperData(
  options: Partial<FalconerRequestInit>,
) {
  const requestUrl = new URL('/haqq/wp', FALCONER_ENDPOINT);

  const response = await fetch(requestUrl, {
    method: 'GET',
    ...options,
  });

  if (!response.ok) {
    throw new Error('Whitepaper fetch failed');
  }

  const responseJson = await response.json();

  return responseJson.wp as string;
}
