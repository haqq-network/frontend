import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useNetwork } from 'wagmi';
import { useSupportedChains } from '../../providers/wagmi-provider';

export function useStakingValidatorListQuery(limit = 1000) {
  const { getValidators } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'validators'],
    queryFn: async () => {
      return await getValidators(limit);
    },
  });
}

export function useStakingRewardsQuery(address: string | undefined) {
  const { getRewardsInfo } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'rewards', address],
    queryFn: async () => {
      if (!address) {
        return null;
      }

      return await getRewardsInfo(address);
    },
  });
}

export function useStakingDelegationQuery(address: string | undefined) {
  const { getAccountDelegations } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'delegation', address],
    queryFn: async () => {
      if (!address) {
        return null;
      }

      return await getAccountDelegations(address);
    },
  });
}

export function useStakingUnbondingsQuery(address: string | undefined) {
  const { getUndelegations } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: address ? [chain.id, 'unbondings', address] : [undefined],
    queryFn: async () => {
      if (!address) {
        return null;
      }

      return await getUndelegations(address);
    },
  });
}

export function useStakingValidatorInfoQuery(valoperAddress: string) {
  const { getValidatorInfo } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'validator', valoperAddress],
    queryFn: async () => {
      return await getValidatorInfo(valoperAddress);
    },
  });
}

export function useStakingParamsQuery() {
  const { getStakingParams } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'staking-params'],
    queryFn: getStakingParams,
  });
}

export function useStakingPoolQuery() {
  const { getStakingPool } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'staking-pool'],
    queryFn: getStakingPool,
  });
}
