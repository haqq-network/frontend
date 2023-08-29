import { cache } from 'react';
import { REVALIDATE_TIME } from '../constants';

export const revalidate = REVALIDATE_TIME;

export const getMainnetAccounts = cache(async (defaultValue: number) => {
  try {
    const accountsResponse = await fetch(
      'https://rest.cosmos.haqq.network/cosmos/auth/v1beta1/accounts?pagination.count_total=true&pagination.limit=1',
    );
    const accounts = await accountsResponse.json();
    return Number.parseInt(accounts.pagination.total, 10);
  } catch (error) {
    console.error('Fetch mainnet accounts count failed', error);
    return defaultValue;
  }
});
