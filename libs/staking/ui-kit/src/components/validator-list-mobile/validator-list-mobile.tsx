import {
  DistributionRewardsResponse,
  GetDelegationsResponse,
  Validator,
} from '@evmos/provider';
import { useCallback } from 'react';
import { ValidatorListItemMobile } from '../validator-list-item-mobile/validator-list-item-mobile';

export function ValidatorsListMobile({
  validators,
  rewardsInfo,
  delegationInfo,
  totalStaked,
  onValidatorClick,
}: {
  validators: Validator[];
  rewardsInfo: DistributionRewardsResponse | null | undefined;
  delegationInfo: GetDelegationsResponse | null | undefined;
  onValidatorClick: (validatorAddress: string) => void;
  totalStaked: number;
}) {
  console.log('ValidatorsListMobile', {
    validators,
    rewardsInfo,
    delegationInfo,
    totalStaked,
  });
  const getValidatorRewards = useCallback(
    (address: string) => {
      const rewards = rewardsInfo?.rewards?.find((rewardsItem) => {
        return rewardsItem.validator_address === address;
      });

      return rewards;
    },
    [rewardsInfo?.rewards],
  );

  const getDelegationInfo = useCallback(
    (address: string) => {
      const delegationAmount = delegationInfo?.delegation_responses?.find(
        (delegation) => {
          return delegation.delegation.validator_address === address;
        },
      );

      return delegationAmount;
    },
    [delegationInfo],
  );

  return (
    <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2">
      {validators.map((validator, index) => {
        const delegationInfo = getDelegationInfo(validator.operator_address);
        const rewardsInfo = getValidatorRewards(validator.operator_address);

        return (
          <ValidatorListItemMobile
            key={`validator-${index}`}
            validator={validator}
            delegation={delegationInfo}
            reward={rewardsInfo}
            stakingPool={totalStaked}
            onClick={onValidatorClick}
          />
        );
      })}
    </div>
  );
}
