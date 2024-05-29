import { FALCONER_ENDPOINT, FalconerRequestInit } from '../../constants';

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
