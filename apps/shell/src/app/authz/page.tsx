import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { headers } from 'next/headers';
import { haqqMainnet } from 'wagmi/chains';
import { createCosmosService, getChainParams } from '@haqq/data-access-cosmos';
import { AuthzPage } from '@haqq/shell-authz';
import {
  ethToHaqq,
  indexerBalancesFetcher,
  parseWagmiCookies,
} from '@haqq/shell-shared';

export default async function Authz() {
  const cookies = headers().get('cookie');
  const { chainId, walletAddress } = parseWagmiCookies(cookies);
  const chainIdToUse = chainId ?? haqqMainnet.id;
  const { cosmosRestEndpoint } = getChainParams(chainIdToUse);
  const queryClient = new QueryClient();
  const { getAuthzGranteeGrants, getAuthzGranterGrants } =
    createCosmosService(cosmosRestEndpoint);

  if (walletAddress) {
    const haqqAddress = ethToHaqq(walletAddress);

    await queryClient.prefetchQuery({
      queryKey: [chainIdToUse, 'indexer-balance', haqqAddress],
      queryFn: async () => {
        return await indexerBalancesFetcher(chainIdToUse, haqqAddress);
      },
    });

    await queryClient.prefetchQuery({
      queryKey: [chainIdToUse, 'grants-grantee', haqqAddress],
      queryFn: async () => {
        return await getAuthzGranteeGrants(haqqAddress);
      },
    });

    await queryClient.prefetchQuery({
      queryKey: [chainIdToUse, 'grants-granter', haqqAddress],
      queryFn: async () => {
        return await getAuthzGranterGrants(haqqAddress);
      },
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <AuthzPage />
    </HydrationBoundary>
  );
}
