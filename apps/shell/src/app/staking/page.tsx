import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { createCosmosService, getChainParams } from '@haqq/data-access-cosmos';
import { ValidatorListPage } from '@haqq/shell-staking';

export default async function ValidatorList() {
  // FIXME: Think how to get chain id on server side
  const chainId = 11235;
  const { cosmosRestEndpoint } = getChainParams(chainId);
  const { getStakingParams, getStakingPool, getValidators } =
    createCosmosService(cosmosRestEndpoint);
  const queryClient = new QueryClient();

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
      <ValidatorListPage />
    </HydrationBoundary>
  );
}
