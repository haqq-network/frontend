import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { haqqMainnet } from 'wagmi/chains';
import { createCosmosService, getChainParams } from '@haqq/data-access-cosmos';
import {
  ethToHaqq,
  indexerBalancesFetcher,
  parseWagmiCookies,
} from '@haqq/shell-shared';
import { ValidatorDetailsPage } from '@haqq/shell-staking';

export default async function ValidatorDetails({
  params: { address },
}: {
  params: { address: string };
}) {
  if (!address) {
    return notFound();
  }

  const cookies = headers().get('cookie');
  const { chainId, walletAddress } = parseWagmiCookies(cookies);
  const chainIdToUse = chainId ?? haqqMainnet.id;
  const { cosmosRestEndpoint } = getChainParams(chainIdToUse);
  const {
    getValidators,
    getValidatorInfo,
    getStakingPool,
    getStakingParams,
    getRewardsInfo,
    getAccountDelegations,
    getUndelegations,
  } = createCosmosService(cosmosRestEndpoint);
  const queryClient = new QueryClient();

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

  await queryClient.prefetchQuery({
    queryKey: [chainIdToUse, 'validator', address],
    queryFn: () => {
      return getValidatorInfo(address);
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
      <ValidatorDetailsPage address={address} />
    </HydrationBoundary>
  );
}
