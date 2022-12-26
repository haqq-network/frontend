import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';

export function useAuthAccountsQuery() {
  const { getAuthAccounts } = useCosmosService();

  return useQuery(['auth-accounts'], getAuthAccounts);
}
