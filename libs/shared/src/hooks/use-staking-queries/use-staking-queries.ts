import {
  DistributionRewardsResponse,
  GetDelegationsResponse,
  UndelegationResponse,
  Validator,
} from '@evmos/provider';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { useAccount, useChains } from 'wagmi';
import { StakingParams, StakingPool } from '@haqq/data-access-cosmos';
import { useCosmosService } from '../../providers/cosmos-provider';

export function useStakingValidatorListQuery(
  limit = 1000,
): UseQueryResult<Validator[], Error> {
  const { getValidators } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'validators'],
    queryFn: async () => {
      return await getValidators(limit);
    },
  });
}

export function useStakingRewardsQuery(
  address: string | undefined,
): UseQueryResult<DistributionRewardsResponse | null, Error> {
  const { getRewardsInfo } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'rewards', address],
    enabled: !!address,
    queryFn: async () => {
      if (!address) {
        return null;
      }

      return await getRewardsInfo(address);
    },
  });
}

export function useStakingDelegationQuery(
  address: string | undefined,
): UseQueryResult<GetDelegationsResponse | null, Error> {
  const { getAccountDelegations } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'delegation', address],
    enabled: !!address,
    queryFn: async () => {
      if (!address) {
        return null;
      }

      return await getAccountDelegations(address);
    },
  });
}

export function useStakingUnbondingsQuery(
  address: string | undefined,
): UseQueryResult<UndelegationResponse[] | null, Error> {
  const { getUndelegations } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'unbondings', address],
    enabled: !!address,
    queryFn: async () => {
      if (!address) {
        return null;
      }

      return await getUndelegations(address);
    },
  });
}

export function useStakingValidatorInfoQuery(
  valoperAddress: string,
): UseQueryResult<Validator | undefined, Error> {
  const { getValidatorInfo } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'validator', valoperAddress],
    enabled: !!valoperAddress,
    queryFn: async () => {
      return await getValidatorInfo(valoperAddress);
    },
  });
}

export function useStakingParamsQuery(): UseQueryResult<StakingParams, Error> {
  const { getStakingParams } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'staking-params'],
    queryFn: getStakingParams,
  });
}

export function useStakingPoolQuery(): UseQueryResult<StakingPool, Error> {
  const { getStakingPool } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'staking-pool'],
    queryFn: getStakingPool,
  });
}
