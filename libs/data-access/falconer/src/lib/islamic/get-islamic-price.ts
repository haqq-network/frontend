import { FALCONER_ENDPOINT } from '../../constants';
import { FalconerRequestInit } from '../../types';

interface HaqqPriceResponse {
  price: number;
}

export async function getIslamicPriceData(
  options: Partial<FalconerRequestInit>,
) {
  const requestUrl = new URL('/islamic/price', FALCONER_ENDPOINT);
  const response = await fetch(requestUrl, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error('Chain stats fetch failed');
  }

  const responseJson: HaqqPriceResponse = await response.json();

  return responseJson.price;
}
