import { useQuery } from '@tanstack/react-query';
import { useAccount, useChains } from 'wagmi';
import { useCosmosService } from '../../providers/cosmos-provider';

export function useDaoBalanceQuery(address: string, denom: string) {
  const { getDaoBalance } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'dao-balance', denom, address],
    enabled: !!address,
    queryFn: async () => {
      return getDaoBalance(address, denom);
    },
  });
}

export function useDaoAllBalancesQuery(address?: string) {
  const { getDaoAllBalances } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'dao-all-balances', address],
    enabled: !!address,
    queryFn: async () => {
      if (!address) {
        return null;
      }

      return getDaoAllBalances(address);
    },
  });
}
