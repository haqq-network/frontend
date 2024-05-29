import { FALCONER_ENDPOINT, FalconerRequestInit } from '../../constants';

export interface HaqqChainStats {
  accounts: string;
  transactionsIn24Hour: string;
  consensusFinality: string;
  transactionAvgCost: string;
  coinomicsEra: string;
  coinomicsEmissionRate: string;
  supply: string;
  coinomicsWillBeMinted: string;
  circulatingSupply: string;
}

export async function getHaqqChainStatsData(
  options: Partial<FalconerRequestInit>,
) {
  const requestUrl = new URL('/haqq/chain_stats', FALCONER_ENDPOINT);
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

  const responseJson: HaqqChainStats = await response.json();

  return responseJson;
}
