import { cache } from 'react';
import { FALCONER_ENDPOINT, REVALIDATE_TIME } from '../constants';

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
  try {
    const response = await fetch(`${FALCONER_ENDPOINT}/haqq/chain_stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate,
      },
    });

    if (response.ok) {
      const data = await response.json();

      return {
        mainnetAccountsCreated: Number.parseFloat(data.accounts),
        transactionsInLast24Hours: Number.parseFloat(data.transactionsIn24Hour),
        secondsToConsensusFinality: Number.parseFloat(data.consensusFinality),
        averageCostPerTransaction: Number.parseFloat(data.transactionAvgCost),
        era: Number.parseFloat(data.coinomicsEra),
        emissionRate: Number.parseFloat(data.coinomicsEmissionRate),
        emittedAlready: Number.parseFloat(data.supply),
        willBeEmitted: Number.parseFloat(data.coinomicsWillBeMinted),
      };
    } else {
      console.log('Response was not ok.', response);
    }
  } catch (error) {
    console.error(error);
  }

  return {
    mainnetAccountsCreated: 0,
    transactionsInLast24Hours: 0,
    secondsToConsensusFinality: 0,
    averageCostPerTransaction: 0,
    era: 0,
    emissionRate: 0,
    emittedAlready: 0,
    willBeEmitted: 0,
  };
});
