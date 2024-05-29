import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { headers } from 'next/headers';
import { haqqMainnet } from 'wagmi/chains';
import { createCosmosService, getChainParams } from '@haqq/data-access-cosmos';
import { MainPage } from '@haqq/shell-main';
import {
  ethToHaqq,
  getShellChainStatsData,
  indexerBalancesFetcher,
  parseWagmiCookies,
} from '@haqq/shell-shared';

export default async function IndexPage() {
  const headersList = headers();
  const cookies = headersList.get('cookie');
  const { chainId, walletAddress } = parseWagmiCookies(cookies);
  const chainIdToUse = chainId ?? haqqMainnet.id;
  const { cosmosRestEndpoint } = getChainParams(chainIdToUse);
  const {
    getProposals,
    getGovernanceParams,
    getValidators,
    getStakingPool,
    getStakingParams,
    getRewardsInfo,
    getAccountDelegations,
  } = createCosmosService(cosmosRestEndpoint);
  const queryClient = new QueryClient();
  const userAgent = headersList.get('user-agent');
  const isMobileUserAgent = Boolean(
    userAgent?.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    ),
  );

  await queryClient.prefetchQuery({
    queryKey: [chainIdToUse, 'chain-stats'],
    queryFn: getShellChainStatsData,
  });

  await queryClient.prefetchQuery({
    queryKey: [chainIdToUse, 'proposals'],
    queryFn: getProposals,
  });

  await queryClient.prefetchQuery({
    queryKey: [chainIdToUse, 'governance-params'],
    queryFn: async () => {
      const [deposit_params, voting_params, tally_params] = await Promise.all([
        getGovernanceParams('deposit').then((res) => {
          return res.deposit_params;
        }),
        getGovernanceParams('voting').then((res) => {
          return res.voting_params;
        }),
        getGovernanceParams('tallying').then((res) => {
          return res.tally_params;
        }),
      ]);

      return {
        deposit_params,
        voting_params,
        tally_params,
      };
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

  await queryClient.prefetchQuery({
    queryKey: [chainIdToUse, 'validators'],
    queryFn: async () => {
      return await getValidators();
    },
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
        if (!haqqAddress) {
          return null;
        }

        return await getRewardsInfo(haqqAddress);
      },
    });

    await queryClient.prefetchQuery({
      queryKey: [chainIdToUse, 'delegation', haqqAddress],
      queryFn: async () => {
        if (!haqqAddress) {
          return null;
        }

        return await getAccountDelegations(haqqAddress);
      },
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <MainPage
        isMobileUserAgent={isMobileUserAgent}
        seedPhrase={Date.now().toString()}
      />
    </HydrationBoundary>
  );
}
