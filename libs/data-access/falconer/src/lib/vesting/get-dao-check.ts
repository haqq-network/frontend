import { FALCONER_ENDPOINT, FalconerRequestInit } from '../../constants';

export async function getVestingDaoCheck(
  address: string,
  options: Partial<FalconerRequestInit> = {},
) {
  const requestUrl = new URL('/vesting/dao_check', FALCONER_ENDPOINT);

  requestUrl.searchParams.append('address', address);

  const response = await fetch(requestUrl, {
    method: 'GET',
    ...options,
  });

  if (!response.ok) {
    throw new Error('Dao participation check failed');
  }

  const responseJson: { participate: boolean } = await response.json();

  return responseJson.participate;
}
