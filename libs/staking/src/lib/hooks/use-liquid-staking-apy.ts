import {
  useCoinomicsParams,
  useStakingValidatorListQuery,
} from '@haqq/shell-shared';
import { StrideValidator, useStideStakingInfo } from './use-stride-rates';

const BLOCKS_PER_YEAR = 1464; // 4 restakes per day * 366 days (accounting for leap years)
const COMMUNITY_POOL_PERCENTAGE = 0.1;
const STRIDE_PERCENTAGE = 0.1;

export function useLiquidStakingApy() {
  const {
    data: validators,
    error,
    isLoading: isValidatorsLoading,
  } = useStakingValidatorListQuery(1000);
  const {
    data: strideData,
    error: strideError,
    isLoading: strideIsLoading,
  } = useStideStakingInfo();
  const { data, isLoading: isCoinomicsParamsLoading } = useCoinomicsParams();

  const rewardCoefficient = data?.reward_coefficient
    ? parseFloat(data.reward_coefficient)
    : 0;
  const rewardAfterCommunityPool =
    rewardCoefficient * (1 - COMMUNITY_POOL_PERCENTAGE);

  let totalApy = 0;
  let validValidatorsCount = 0;

  const strideValidatorsMap =
    strideData?.validators.reduce(
      (acc: Record<string, StrideValidator>, validator: StrideValidator) => {
        acc[validator.address] = validator;
        return acc;
      },
      {},
    ) || {};

  const filteredValidators =
    validators?.filter((validator) => {
      return strideValidatorsMap
        ? !!strideValidatorsMap[validator.operator_address]
        : false;
    }) ?? [];

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
    isLoading:
      strideIsLoading || isValidatorsLoading || isCoinomicsParamsLoading,
    error: strideError || error,
  };
}
