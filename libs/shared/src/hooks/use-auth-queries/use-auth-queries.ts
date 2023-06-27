import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useNetwork } from 'wagmi';

export function useAuthAccountsQuery() {
  const { getAuthAccounts } = useCosmosService();
  const { chain } = useNetwork();

  return useQuery([chain?.id, 'auth-accounts'], getAuthAccounts);
}
