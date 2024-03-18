import { useQuery } from '@tanstack/react-query';
import { useNetwork } from 'wagmi';
import { useSupportedChains } from '../../providers/wagmi-provider';

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

interface FalconerRequestInit extends RequestInit {
  next?: {
    revalidate?: number;
  };
}

export async function getShellChainStatsData(
  options: Partial<FalconerRequestInit>,
) {
  const requestUrl = new URL('/shell/chain_stats', 'https://falconer.haqq.sh');
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

export function useChainStatsQuery() {
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'chain-stats'],
    queryFn: getShellChainStatsData,
  });
}