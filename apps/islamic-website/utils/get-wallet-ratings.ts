import { cache } from 'react';
import { DEPLOY_URL, REVALIDATE_TIME } from '../constants';

export const revalidate = REVALIDATE_TIME;

export interface WalletStoreRatings {
  appStore: number;
  googlePlay: number;
}

export const getWalletRatings = cache(async () => {
  const ratesEndpoint = new URL('/api/wallet-store-rates', DEPLOY_URL);
  const response = await fetch(ratesEndpoint, {
    next: {
      revalidate,
    },
  });

  const data: WalletStoreRatings = await response.json();

  return data;
});
