import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { createCosmosService, getChainParams } from '@haqq/data-access-cosmos';
import { ValidatorDetailsPage } from '@haqq/shell-staking';

export default async function ValidatorDetails({
  params: { address },
}: {
  params: { address: string };
}) {
  if (!address) {
    return notFound();
  }

  const chainId = 11235;
  const { cosmosRestEndpoint } = getChainParams(chainId);
  const { getValidatorInfo, getStakingPool } =
    createCosmosService(cosmosRestEndpoint);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [chainId, 'validator', address],
    queryFn: () => {
      return getValidatorInfo(address);
    },
  });

  await queryClient.prefetchQuery({
    queryKey: [chainId, 'staking-pool'],
    queryFn: getStakingPool,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ValidatorDetailsPage address={address} />
    </HydrationBoundary>
  );
}
