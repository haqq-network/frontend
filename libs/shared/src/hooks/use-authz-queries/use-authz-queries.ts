import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useNetwork } from 'wagmi';

export function useAuthzGrantsQuery(granter: string, grantee: string) {
  const { getAuthzGrants } = useCosmosService();
  const { chain } = useNetwork();

  return useQuery(
    [chain?.id, 'authz-grants', granter, grantee],
    async () => {
      return await getAuthzGrants(granter, grantee);
    },
    {
      refetchOnWindowFocus: false,
    },
  );
}
