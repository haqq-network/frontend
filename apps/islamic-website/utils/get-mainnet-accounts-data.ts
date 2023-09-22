import { cache } from 'react';
import { REVALIDATE_TIME } from '../constants';

export const revalidate = REVALIDATE_TIME;

export const getMainnetAccounts = cache(async (defaultValue: number) => {
  try {
    const authAccountsUrl = new URL(
      '/cosmos/auth/v1beta1/accounts',
      'https://rest.cosmos.haqq.network',
    );

    authAccountsUrl.searchParams.append('pagination.limit', '0');

    const accountsResponse = await fetch(authAccountsUrl.toString());
    const accounts = await accountsResponse.json();
    return Number.parseInt(accounts.pagination.total, 10);
  } catch (error) {
    console.error('Fetch mainnet accounts count failed', error);
    return defaultValue;
  }
});
