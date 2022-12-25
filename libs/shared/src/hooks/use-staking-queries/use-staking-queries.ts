import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';

export function useStakingValidatorListQuery(limit = 1000) {
  const { getAllValidators } = useCosmosService();

  return useQuery(['validators'], () => {
    return getAllValidators(limit);
  });
}

export function useStakingRewardsQuery(address: string | undefined) {
  const { getRewardsInfo } = useCosmosService();

  return useQuery(['rewards', address], () => {
    if (!address) {
      return null;
    }

    return getRewardsInfo(address);
  });
}

export function useStakingDelegationQuery(address: string | undefined) {
  const { getAccountDelegations } = useCosmosService();

  return useQuery(['delegation', address], () => {
    if (!address) {
      return null;
    }

    return getAccountDelegations(address);
  });
}

export function useStakingUnbondingsQuery(address: string | undefined) {
  const { getUndelegations } = useCosmosService();

  return useQuery(
    ['unboundings', address],
    () => {
      if (!address) {
        return null;
      }

      return getUndelegations(address);
    },
    {
      refetchInterval: 2500,
    },
  );
}

export function useStakingValidatorInfoQuery(
  valoperAddress: string | undefined,
) {
  const { getValidatorInfo } = useCosmosService();

  return useQuery(
    ['validator', valoperAddress],
    () => {
      if (!valoperAddress) {
        return null;
      }

      return getValidatorInfo(valoperAddress);
    },
    {
      refetchOnWindowFocus: false,
    },
  );
}

export function useStakingParamsQuery() {
  const { getStakingParams } = useCosmosService();

  return useQuery(['staking-params'], getStakingParams);
}
