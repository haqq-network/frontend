import { useCallback } from 'react';
import {
  DistributionRewardsResponse,
  GetDelegationsResponse,
  Validator,
} from '@evmos/provider';
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

  if (validators.length === 0) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center space-y-8">
        <div className="font-guise text-[10px] uppercase leading-[1.2em]">
          Nothing found
        </div>
      </div>
    );
  }

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
