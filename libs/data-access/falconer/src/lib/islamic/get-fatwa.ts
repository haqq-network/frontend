import { FALCONER_ENDPOINT } from '../../constants';
import { FalconerRequestInit } from '../../types';

export async function getIslamicFatwa(
  options: Partial<FalconerRequestInit>,
  locale: string,
) {
  const requestUrl = new URL(
    `/islamic/fatwa?locale=${locale}`,
    FALCONER_ENDPOINT,
  );
  const response = await fetch(requestUrl, {
    method: 'GET',
    ...options,
  });

  if (!response.ok) {
    throw new Error('Fatwa fetch failed');
  }

  const responseJson = await response.json();

  return responseJson.fatwa as string;
}
