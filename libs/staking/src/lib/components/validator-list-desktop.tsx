import { useCallback } from 'react';
import {
  DistributionRewardsResponse,
  GetDelegationsResponse,
  Validator,
} from '@evmos/provider';
import clsx from 'clsx';
import { ValidatorListItemDesktop } from './validator-list-item-desktop';
import { SortDirection, SortState } from '../hooks/use-validator-sort';

function SortDirectionArrow({ direction }: { direction: SortDirection }) {
  if (!direction) {
    return null;
  }

  return (
    <span className="absolute right-[-16px] top-[0px] text-[12px] leading-[14px]">
      {direction === 'asc' ? '▼' : '▲'}
    </span>
  );
}

export function ValidatorsListDesktop({
  validators,
  rewardsInfo,
  delegationInfo,
  totalStaked,
  onValidatorClick,
  onDesktopSortClick,
  sortState,
}: {
  validators: Validator[];
  rewardsInfo: DistributionRewardsResponse | null | undefined;
  delegationInfo: GetDelegationsResponse | null | undefined;
  onValidatorClick: (validatorAddress: string) => void;
  totalStaked: number;
  onDesktopSortClick: (key: string) => void;
  sortState: SortState;
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

  return (
    <table className="w-full table-fixed">
      <thead className="text-[10px] uppercase leading-[1.2em] text-white/50 md:text-[12px]">
        <tr>
          <th className="w-[25%] p-[8px] text-left lg:p-[12px]">
            <div
              className={clsx(
                'relative inline-block cursor-pointer select-none',
                sortState.key !== 'random' &&
                  sortState.key === 'name' &&
                  'text-white',
              )}
              onClick={() => {
                onDesktopSortClick('name');
              }}
            >
              Name
              {sortState.key !== 'random' && sortState.key === 'name' && (
                <SortDirectionArrow direction={sortState.direction} />
              )}
            </div>
          </th>
          <th className="w-[100px] p-[8px] text-left lg:p-[12px]">
            <div className="select-none">
              Status
              {sortState.key !== 'random' && sortState.key === 'status' && (
                <SortDirectionArrow direction={sortState.direction} />
              )}
            </div>
          </th>
          <th className="w-[100px] p-[8px] text-right lg:p-[12px]">
            <div
              className={clsx(
                'relative inline-block cursor-pointer select-none',
                sortState.key !== 'random' &&
                  sortState.key === 'fee' &&
                  'text-white',
              )}
              onClick={() => {
                onDesktopSortClick('fee');
              }}
            >
              Fee
              {sortState.key !== 'random' && sortState.key === 'fee' && (
                <SortDirectionArrow direction={sortState.direction} />
              )}
            </div>
          </th>
          <th className="min-w-[170px] p-[8px] text-right lg:p-[12px]">
            <div
              className={clsx(
                'relative inline-block cursor-pointer select-none',
                sortState.key !== 'random' &&
                  sortState.key === 'votingPower' &&
                  'text-white',
              )}
              onClick={() => {
                onDesktopSortClick('votingPower');
              }}
            >
              Voting power
              {sortState.key !== 'random' &&
                sortState.key === 'votingPower' && (
                  <SortDirectionArrow direction={sortState.direction} />
                )}
            </div>
          </th>
          <th className="p-[8px] text-right lg:p-[12px]">
            <div
              className={clsx(
                'relative inline-block cursor-pointer select-none',
                sortState.key !== 'random' &&
                  sortState.key === 'votingPowerPercent' &&
                  'text-white',
              )}
              onClick={() => {
                onDesktopSortClick('votingPowerPercent');
              }}
            >
              Voting power %
              {sortState.key !== 'random' &&
                sortState.key === 'votingPowerPercent' && (
                  <SortDirectionArrow direction={sortState.direction} />
                )}
            </div>
          </th>
          <th className="p-[8px] text-right lg:p-[12px]">
            <div
              className={clsx(
                'relative inline-block cursor-pointer select-none',
                sortState.key !== 'random' &&
                  sortState.key === 'staked' &&
                  'text-white',
              )}
              onClick={() => {
                onDesktopSortClick('staked');
              }}
            >
              My stake
              {sortState.key !== 'random' && sortState.key === 'staked' && (
                <SortDirectionArrow direction={sortState.direction} />
              )}
            </div>
          </th>
          <th className="p-[8px] text-right lg:p-[12px]">
            <div
              className={clsx(
                'relative inline-block cursor-pointer select-none',
                sortState.key !== 'random' &&
                  sortState.key === 'reward' &&
                  'text-white',
              )}
              onClick={() => {
                onDesktopSortClick('reward');
              }}
            >
              My rewards
              {sortState.key !== 'random' && sortState.key === 'reward' && (
                <SortDirectionArrow direction={sortState.direction} />
              )}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {validators.map((validator, index) => {
          const delegationInfo = getDelegationInfo(validator.operator_address);
          const rewardsInfo = getValidatorRewards(validator.operator_address);

          return (
            <ValidatorListItemDesktop
              key={`validator-${index}`}
              validator={validator}
              delegation={delegationInfo}
              reward={rewardsInfo}
              stakingPool={totalStaked}
              onClick={onValidatorClick}
            />
          );
        })}
      </tbody>
    </table>
  );
}
