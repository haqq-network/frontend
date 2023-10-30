import { cache } from 'react';
import { FALCONER_ENDPOINT, REVALIDATE_TIME } from '../constants';

export const revalidate = REVALIDATE_TIME;

export const getChainStatsData = cache(async () => {
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
        mainnetAccountsCreated: Number.parseInt(data.accounts, 10),
        transactionsInLast24Hours: Number.parseInt(
          data.transactionsIn24Hour,
          10,
        ),
        secondsToConsensusFinality: Number.parseInt(data.consensusFinality, 10),
        averageCostPerTransaction: Number.parseInt(data.transactionAvgCost, 10),
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
  };
});
