import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { headers } from 'next/headers';
import { haqqMainnet } from 'wagmi/chains';
import { createCosmosService, getChainParams } from '@haqq/data-access-cosmos';
import { DaoPage } from '@haqq/shell-dao';
import {
  ethToHaqq,
  indexerBalancesFetcher,
  parseWagmiCookies,
} from '@haqq/shell-shared';

export default async function Authz() {
  const cookies = headers().get('cookie');
  const { chainId, walletAddress } = parseWagmiCookies(cookies);
  const chainIdToUse = chainId ?? haqqMainnet.id;
  const queryClient = new QueryClient();
  const { cosmosRestEndpoint } = getChainParams(chainIdToUse);
  const { getErc20TokenPairs } = createCosmosService(cosmosRestEndpoint);

  if (walletAddress) {
    const haqqAddress = ethToHaqq(walletAddress);

    await queryClient.prefetchQuery({
      queryKey: [chainIdToUse, 'indexer-balance', haqqAddress],
      queryFn: async () => {
        return await indexerBalancesFetcher(chainIdToUse, haqqAddress);
      },
    });

    await queryClient.prefetchQuery({
      queryKey: [chainIdToUse, 'token-pairs'],
      queryFn: getErc20TokenPairs,
    });
  }
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <DaoPage />
    </HydrationBoundary>
  );
}
