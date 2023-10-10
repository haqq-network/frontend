import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { Validator } from '@evmos/provider';
import { useNetwork } from 'wagmi';
import { useSupportedChains } from '../../providers/wagmi-provider';

export function useStakingValidatorListQuery(limit = 1000) {
  const { getValidators } = useCosmosService();
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery<Validator[], Error>(
    [chainId, 'validators'],
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
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery([chainId, 'rewards', address], () => {
    if (!address) {
      return null;
    }

    return getRewardsInfo(address);
  });
}

export function useStakingDelegationQuery(address: string | undefined) {
  const { getAccountDelegations } = useCosmosService();
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery([chainId, 'delegation', address], () => {
    if (!address) {
      return null;
    }

    return getAccountDelegations(address);
  });
}

export function useStakingUnbondingsQuery(address: string | undefined) {
  const { getUndelegations } = useCosmosService();
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery(
    [chainId, 'unboundings', address],
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
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery(
    [chainId, 'validator', valoperAddress],
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
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery([chainId, 'staking-params'], getStakingParams);
}

export function useStakingPoolQuery() {
  const { getStakingPool } = useCosmosService();
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery([chainId, 'staking-pool'], getStakingPool);
}
