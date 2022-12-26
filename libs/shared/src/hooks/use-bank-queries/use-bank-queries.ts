import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';

export function useBankSupplyQuery() {
  const { getBankSupply } = useCosmosService();

  return useQuery(['bank-supply'], getBankSupply);
}
