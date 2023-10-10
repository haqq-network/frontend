import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useNetwork } from 'wagmi';
import { useSupportedChains } from '../../providers/wagmi-provider';

export function useAuthzGrantsQuery(granter: string, grantee: string) {
  const { getAuthzGrants } = useCosmosService();
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery(
    [chainId, 'grants', granter, grantee],
    async () => {
      return await getAuthzGrants(granter, grantee);
    },
    {
      refetchOnWindowFocus: false,
    },
  );
}

export function useAuthzGranterGrants(granter: string) {
  const { getAuthzGranterGrants } = useCosmosService();
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery(
    [chainId, 'grants-granter', granter],
    async () => {
      return await getAuthzGranterGrants(granter);
    },
    {
      refetchOnWindowFocus: false,
    },
  );
}

export function useAuthzGranteeGrants(grantee: string) {
  const { getAuthzGranteeGrants } = useCosmosService();
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery(
    [chainId, 'grants-grantee', grantee],
    async () => {
      return await getAuthzGranteeGrants(grantee);
    },
    {
      refetchOnWindowFocus: false,
    },
  );
}
