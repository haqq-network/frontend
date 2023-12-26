import { FALCONER_ENDPOINT } from '../../constants';
import { FalconerRequestInit } from '../../types';

export async function getHaqqPrivacyPolicyData(
  options: Partial<FalconerRequestInit>,
) {
  const requestUrl = new URL('/haqq/pp', FALCONER_ENDPOINT);
  const response = await fetch(requestUrl, {
    method: 'GET',
    ...options,
  });

  if (!response.ok) {
    throw new Error('Privacy policy fetch failed');
  }

  const responseJson = await response.json();

  return responseJson.pp as string;
}
