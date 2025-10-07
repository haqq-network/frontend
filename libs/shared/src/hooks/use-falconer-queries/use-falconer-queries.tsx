import { useQueries } from '@tanstack/react-query';
import { useAccount, useChains } from 'wagmi';

interface ShellChainStats {
  dailyTxCount: string;
  consensusFinality: string;
  transactionAvgCost: string;
  accounts: string;
  supply: string;
  staked: string;
  stakeRatio: string;
  validatorsCount: string;
  validatorsActive: string;
}

interface CosmosStakingParams {
  params: {
    unbonding_time: string;
    max_validators: number;
    max_entries: number;
    historical_entries: number;
    bond_denom: string;
    min_commission_rate: string;
  };
}

interface FalconerRequestInit extends RequestInit {
  next?: {
    revalidate?: number;
  };
}

export async function getShellChainStatsData(
  options: Partial<FalconerRequestInit>,
) {
  const requestUrl = new URL(
    '/shell/chain_stats',
    'https://falconer.haqq.network',
  );
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

  const { stats }: { stats: ShellChainStats } = await response.json();

  return stats;
}

export async function getCosmosStakingParams() {
  const requestUrl = new URL(
    '/cosmos/staking/v1beta1/params',
    'https://rest.cosmos.haqq.network',
  );
  const response = await fetch(requestUrl, {
    method: 'get',
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Staking params fetch failed');
  }

  const data: CosmosStakingParams = await response.json();

  return data;
}

export function useChainStatsQuery() {
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  const [chainStatsQuery, stakingParamsQuery] = useQueries({
    queries: [
      {
        queryKey: [chain.id, 'chain-stats'],
        queryFn: () => {
          return getShellChainStatsData({});
        },
      },
      {
        queryKey: ['cosmos-staking-params'],
        queryFn: getCosmosStakingParams,
      },
    ],
  });

  const combinedData = chainStatsQuery.data
    ? {
        ...chainStatsQuery.data,
        validatorsCount: stakingParamsQuery.data
          ? String(stakingParamsQuery.data.params.max_validators)
          : chainStatsQuery.data.validatorsCount,
      }
    : undefined;
  console.log('combinedData', combinedData);

  return {
    data: combinedData,
    isFetching: chainStatsQuery.isLoading || stakingParamsQuery.isLoading,
    isFetched: chainStatsQuery.isFetched || stakingParamsQuery.isFetched,
    isError: chainStatsQuery.isError || stakingParamsQuery.isError,
    error: chainStatsQuery.error || stakingParamsQuery.error,
  };
}
