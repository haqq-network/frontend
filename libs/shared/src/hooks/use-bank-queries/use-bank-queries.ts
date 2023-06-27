import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useNetwork } from 'wagmi';

export function useBankSupplyQuery() {
  const { getBankSupply } = useCosmosService();
  const { chain } = useNetwork();

  return useQuery([chain?.id, 'bank-supply'], getBankSupply);
}
