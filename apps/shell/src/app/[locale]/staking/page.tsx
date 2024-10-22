import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { headers } from 'next/headers';
import { createCosmosService, getChainParams } from '@haqq/data-access-cosmos';
import {
  ethToHaqq,
  indexerBalancesFetcher,
  parseWagmiCookies,
} from '@haqq/shell-shared';
import { ValidatorListPage } from '@haqq/shell-staking';
import { supportedChainsIds } from '../../../config/wagmi-config';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function ValidatorList() {
  const headersList = headers();
  const cookies = headersList.get('cookie');
  const { chainId, walletAddress } = parseWagmiCookies(cookies);
  const chainIdToUse =
    chainId && supportedChainsIds.includes(chainId)
      ? chainId
      : supportedChainsIds[0];
  const { cosmosRestEndpoint } = getChainParams(chainIdToUse);
  const {
    getStakingParams,
    getStakingPool,
    getValidators,
    getRewardsInfo,
    getAccountDelegations,
    getUndelegations,
  } = createCosmosService(cosmosRestEndpoint);
  const queryClient = new QueryClient();
  const userAgent = headersList.get('user-agent');
  const isMobileUserAgent = Boolean(
    userAgent?.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    ),
  );

  await queryClient.prefetchQuery({
    queryKey: [chainIdToUse, 'validators'],
    queryFn: async () => {
      return await getValidators();
    },
  });

  await queryClient.prefetchQuery({
    queryKey: [chainIdToUse, 'staking-pool'],
    queryFn: getStakingPool,
  });

  await queryClient.prefetchQuery({
    queryKey: [chainIdToUse, 'staking-params'],
    queryFn: getStakingParams,
  });

  if (walletAddress) {
    const haqqAddress = ethToHaqq(walletAddress);

    await queryClient.prefetchQuery({
      queryKey: [chainIdToUse, 'indexer-balance', haqqAddress],
      queryFn: async () => {
        return await indexerBalancesFetcher(chainIdToUse, haqqAddress);
      },
    });

    await queryClient.prefetchQuery({
      queryKey: [chainIdToUse, 'rewards', haqqAddress],
      queryFn: async () => {
        return await getRewardsInfo(haqqAddress);
      },
    });

    await queryClient.prefetchQuery({
      queryKey: [chainIdToUse, 'delegation', haqqAddress],
      queryFn: async () => {
        return await getAccountDelegations(haqqAddress);
      },
    });

    await queryClient.prefetchQuery({
      queryKey: [chainIdToUse, 'unbondings', haqqAddress],
      queryFn: async () => {
        return await getUndelegations(haqqAddress);
      },
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ValidatorListPage
        isMobileUserAgent={isMobileUserAgent}
        seedPhrase={Date.now().toString()}
      />
    </HydrationBoundary>
  );
}
