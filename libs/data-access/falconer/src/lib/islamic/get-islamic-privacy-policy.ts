import { FALCONER_ENDPOINT, FalconerRequestInit } from '../../constants';

export async function getIslamicPrivacyPolicyData(
  options: Partial<FalconerRequestInit>,
  locale: string,
) {
  const requestUrl = new URL('/islamic/pp', FALCONER_ENDPOINT);

  requestUrl.searchParams.append('locale', locale);

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
