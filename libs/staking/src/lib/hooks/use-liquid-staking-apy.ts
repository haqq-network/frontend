import { useQuery } from '@tanstack/react-query';
import { useChainId } from 'wagmi';
import {
  chains,
  generateEndpointCoinomicsParams,
} from '@haqq/data-access-cosmos';
import { useStakingData } from './use-staking-data';
import { useStideStakingInfo } from './use-stride-rates';

const BLOCKS_PER_YEAR = 1464; // 4 restakes per day * 366 days (accounting for leap years)
const COMMUNITY_POOL_PERCENTAGE = 0.1;
const STRIDE_PERCENTAGE = 0.1;

const fetchParams = async (chainId: number) => {
  const response = await fetch(
    `${chains[chainId].cosmosRestEndpoint}${generateEndpointCoinomicsParams()}`,
  );
  return response.json();
};

const phrase = Date.now().toString();

export function useLiquidStakingApy() {
  const { validators } = useStakingData({
    showOnlyMyDelegation: false,
    inactiveValidatorsVisible: false,
    seedPhrase: phrase,
  });

  const chainId = useChainId();

  const {
    data: strideData,
    error: strideError,
    isLoading: strideIsLoading,
  } = useStideStakingInfo();

  const { data, error, isLoading } = useQuery({
    queryKey: ['liquidStakingParams'],
    queryFn: () => {
      return fetchParams(chainId);
    },
  });

  const rewardCoefficient = data?.params?.reward_coefficient
    ? parseFloat(data.params.reward_coefficient)
    : 0;
  const rewardAfterCommunityPool =
    rewardCoefficient * (1 - COMMUNITY_POOL_PERCENTAGE);

  let totalApy = 0;
  let validValidatorsCount = 0;

  const strideValidatorsMap =
    strideData?.validators.reduce(
      (acc: Record<string, any>, validator: any) => {
        acc[validator.address] = validator;
        return acc;
      },
      {},
    ) || {};

  const filteredValidators = validators.filter((validator) => {
    return strideValidatorsMap
      ? !!strideValidatorsMap[validator.operator_address]
      : false;
  });

  filteredValidators.forEach((validator) => {
    if (
      validator.commission &&
      validator.commission.commission_rates &&
      validator.commission.commission_rates.rate
    ) {
      const validatorCommission = parseFloat(
        validator.commission.commission_rates.rate,
      );
      const rewardAfterValidator =
        rewardAfterCommunityPool * (1 - validatorCommission);

      const rewardCompoundInterest =
        (Math.pow(
          rewardAfterValidator / (100 * BLOCKS_PER_YEAR) + 1,
          BLOCKS_PER_YEAR,
        ) -
          1) *
        100;

      const validatorApy = rewardCompoundInterest * (1 - STRIDE_PERCENTAGE);
      totalApy += validatorApy;
      validValidatorsCount++;
    }
  });

  const averageApy =
    validValidatorsCount > 0 ? totalApy / validValidatorsCount : 0;

  const apy = averageApy.toFixed(2);

  return {
    apy,
    strideFee: STRIDE_PERCENTAGE * 100,
    isLoading: strideIsLoading || isLoading,
    error: strideError || error,
  };
}
