import { useQuery } from '@tanstack/react-query';
import { useNetwork } from 'wagmi';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useSupportedChains } from '../../providers/wagmi-provider';

export function useBankSupplyQuery() {
  const { getBankSupply } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'bank-supply'],
    queryFn: getBankSupply,
  });
}

export function useBankBalance(address: string | undefined) {
  const { getBankBalances } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

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
