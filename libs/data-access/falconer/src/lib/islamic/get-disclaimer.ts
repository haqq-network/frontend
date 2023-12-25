import { FALCONER_ENDPOINT } from '../../constants';
import { FalconerRequestInit } from '../../types';

export async function getIslamicDisclaimer(
  options: Partial<FalconerRequestInit>,
  locale: string,
) {
  const requestUrl = new URL(
    `/islamic/disclaimer?locale=${locale}`,
    FALCONER_ENDPOINT,
  );
  const response = await fetch(requestUrl, {
    method: 'GET',
    ...options,
  });

  if (!response.ok) {
    throw new Error('Disclaimer fetch failed');
  }

  const responseJson = await response.json();

  return responseJson.disclaimer as string;
}
