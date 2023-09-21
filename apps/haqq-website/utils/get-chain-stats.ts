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

export const getChainStats = cache(async () => {
  const mainnetAccountsCreated = await getMainnetAccounts(1163361);

  return {
    mainnetAccountsCreated,
    transactionsInLast24Hours: 210000,
    secondsToConsensusFinality: 5.6,
    averageCostPerTransaction: 147,
    era: 1,
    emissionRate: 0,
    emittedAlready: 20000000000,
    willBeEmitted: 80000000000,
  };
});
