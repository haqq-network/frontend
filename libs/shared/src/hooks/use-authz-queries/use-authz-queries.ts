import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useNetwork } from 'wagmi';
import { useSupportedChains } from '../../providers/wagmi-provider';

export function useAuthzGrantsQuery(granter: string, grantee: string) {
  const { getAuthzGrants } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'grants', granter, grantee],
    queryFn: async () => {
      return await getAuthzGrants(granter, grantee);
    },
  });
}

export function useAuthzGranterGrants(granter: string) {
  const { getAuthzGranterGrants } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'grants-granter', granter],
    queryFn: async () => {
      return await getAuthzGranterGrants(granter);
    },
  });
}

export function useAuthzGranteeGrants(grantee: string) {
  const { getAuthzGranteeGrants } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'grants-grantee', grantee],
    queryFn: async () => {
      return await getAuthzGranteeGrants(grantee);
    },
  });
}
