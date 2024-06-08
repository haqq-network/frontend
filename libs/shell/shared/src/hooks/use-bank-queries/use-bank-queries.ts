import { useQuery } from '@tanstack/react-query';
import { useAccount, useChains } from 'wagmi';
import { useCosmosService } from '../../providers/cosmos-provider';

export function useBankSupplyQuery() {
  const { getBankSupply } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'bank-supply'],
    queryFn: getBankSupply,
  });
}

export function useBankBalance(address: string | undefined) {
  const { getBankBalances } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'bank-balance', address],
    enabled: !!address,
    queryFn: async () => {
      if (!address) {
        return null;
      }

      return await getBankBalances(address);
    },
  });
}
