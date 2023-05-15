import { useCallback, useMemo } from 'react';
import { ValidatorListItem } from '../validator-list-item/validator-list-item';
import type {
  DistributionRewardsResponse,
  GetDelegationsResponse,
  Validator,
} from '@evmos/provider';
import { useStakingPoolQuery } from '@haqq/shared';

interface ValidatorListProps {
  validators: Validator[];
  rewardsInfo: DistributionRewardsResponse | null | undefined;
  delegationInfo: GetDelegationsResponse | null | undefined;
}

export function ValidatorsList({
  validators,
  rewardsInfo,
  delegationInfo,
}: ValidatorListProps) {
  const { data: stakingPool } = useStakingPoolQuery();
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

  const totalStaked = useMemo(() => {
    return Number.parseInt(stakingPool?.pool.bonded_tokens ?? '0') / 10 ** 18;
  }, [stakingPool?.pool.bonded_tokens]);

  return (
    <table className="w-full table-fixed">
      <thead className="text-[12px] uppercase leading-[1.2em] text-white/50">
        <tr>
          <th className="p-[12px] text-left">Name</th>
          <th className="p-[12px] text-left">Status</th>
          <th className="p-[12px] text-left">Fee</th>
          <th className="p-[12px] text-right">Voting power</th>
          <th className="p-[12px] text-right">Voting power %</th>
          <th className="p-[12px] text-right">Staked</th>
          <th className="p-[12px] text-right">Reward</th>
        </tr>
      </thead>
      <tbody>
        {validators.map((validator, index) => {
          const delegationInfo = getDelegationInfo(validator.operator_address);
          const rewardsInfo = getValidatorRewards(validator.operator_address);

          return (
            <ValidatorListItem
              key={`validator-${index}`}
              validator={validator}
              delegation={delegationInfo}
              reward={rewardsInfo}
              stakingPool={totalStaked}
            />
          );
        })}
      </tbody>
    </table>
  );
}
