import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { createCosmosService, getChainParams } from '@haqq/data-access-cosmos';
import { MainPage } from '@haqq/shell-main';
import { getShellChainStatsData } from '@haqq/shell-shared';

export default async function IndexPage() {
  // FIXME: Think how to get chain id on server side
  const chainId = 11235;
  const { cosmosRestEndpoint } = getChainParams(chainId);
  const {
    getProposals,
    getGovernanceParams,
    getValidators,
    getStakingPool,
    getStakingParams,
  } = createCosmosService(cosmosRestEndpoint);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [chainId, 'chain-stats'],
    queryFn: getShellChainStatsData,
  });

  await queryClient.prefetchQuery({
    queryKey: [chainId, 'proposals'],
    queryFn: getProposals,
  });

  await queryClient.prefetchQuery({
    queryKey: [chainId, 'governance-params'],
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
    queryKey: [chainId, 'staking-pool'],
    queryFn: getStakingPool,
  });

  await queryClient.prefetchQuery({
    queryKey: [chainId, 'staking-params'],
    queryFn: getStakingParams,
  });

  await queryClient.prefetchQuery({
    queryKey: [chainId, 'validators'],
    queryFn: async () => {
      return await getValidators(1000);
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <MainPage />
    </HydrationBoundary>
  );
}
