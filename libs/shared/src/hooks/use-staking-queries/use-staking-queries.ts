import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { Validator } from '@evmos/provider';
import { useNetwork } from 'wagmi';
import { useSupportedChains } from '../../providers/wagmi-provider';

export function useStakingValidatorListQuery(limit = 1000) {
  const { getValidators } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery<Validator[], Error>(
    [chain.id, 'validators'],
    () => {
      return getValidators ? getValidators(limit) : [];
    },
    {
      refetchOnWindowFocus: false,
    },
  );
}

export function useStakingRewardsQuery(address: string | undefined) {
  const { getRewardsInfo } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery([chain.id, 'rewards', address], () => {
    if (!address) {
      return null;
    }

    return getRewardsInfo(address);
  });
}

export function useStakingDelegationQuery(address: string | undefined) {
  const { getAccountDelegations } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery([chain.id, 'delegation', address], () => {
    if (!address) {
      return null;
    }

    return getAccountDelegations(address);
  });
}

export function useStakingUnbondingsQuery(address: string | undefined) {
  const { getUndelegations } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery(
    [chain.id, 'unboundings', address],
    () => {
      if (!address) {
        return null;
      }

      return getUndelegations(address);
    },
    {
      refetchOnWindowFocus: true,
    },
  );
}

export function useStakingValidatorInfoQuery(
  valoperAddress: string | undefined,
) {
  const { getValidatorInfo } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery(
    [chain.id, 'validator', valoperAddress],
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
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery([chain.id, 'staking-params'], getStakingParams);
}

export function useStakingPoolQuery() {
  const { getStakingPool } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery([chain.id, 'staking-pool'], getStakingPool);
}
