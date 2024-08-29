import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { headers } from 'next/headers';
import { createCosmosService, getChainParams } from '@haqq/data-access-cosmos';
import {
  ethToHaqq,
  indexerBalancesFetcher,
  parseWagmiCookies,
} from '@haqq/shell-shared';
<<<<<<< Updated upstream:apps/shell/src/app/dao/page.tsx
import { supportedChainsIds } from '../../config/wagmi-config';
=======
import { UCDaoPage } from '@haqq/shell-ucdao';
>>>>>>> Stashed changes:apps/shell/src/app/ucdao/page.tsx

export default async function Authz() {
  const cookies = headers().get('cookie');
  const { chainId, walletAddress } = parseWagmiCookies(cookies);
  const chainIdToUse =
    chainId && supportedChainsIds.includes(chainId)
      ? chainId
      : supportedChainsIds[0];
  const queryClient = new QueryClient();
  const { cosmosRestEndpoint } = getChainParams(chainIdToUse);
  const { getErc20TokenPairs, getDaoAllBalances, getBankBalances } =
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
      queryKey: [chainIdToUse, 'token-pairs'],
      queryFn: getErc20TokenPairs,
    });

    await queryClient.prefetchQuery({
      queryKey: [chainIdToUse, 'dao-all-balances', haqqAddress],
      queryFn: async () => {
        return await getDaoAllBalances(haqqAddress);
      },
    });

    await queryClient.prefetchQuery({
      queryKey: [chainIdToUse, 'bank-balance', haqqAddress],
      queryFn: async () => {
        return await getBankBalances(haqqAddress);
      },
    });
  }
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <UCDaoPage />
    </HydrationBoundary>
  );
}
