import { cache } from 'react';
import { REVALIDATE_TIME } from '../constants';
import { getChainStats } from '@haqq/data-access-falconer';

export const revalidate = REVALIDATE_TIME;

export const getChainStatsFromFalconer = cache(async () => {
  try {
    const stats = await getChainStats({
      next: {
        revalidate,
      },
    });

    return {
      mainnetAccountsCreated: Number.parseFloat(stats.accounts),
      transactionsInLast24Hours: Number.parseFloat(stats.transactionsIn24Hour),
      secondsToConsensusFinality: Number.parseFloat(stats.consensusFinality),
      averageCostPerTransaction: Number.parseFloat(stats.transactionAvgCost),
      era: Number.parseFloat(stats.coinomicsEra),
      emissionRate: Number.parseFloat(stats.coinomicsEmissionRate),
      emittedAlready: Number.parseFloat(stats.supply),
      willBeEmitted: Number.parseFloat(stats.coinomicsWillBeMinted),
    };
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
