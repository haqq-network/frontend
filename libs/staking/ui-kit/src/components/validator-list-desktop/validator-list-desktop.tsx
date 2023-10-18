import {
  DistributionRewardsResponse,
  GetDelegationsResponse,
  Validator,
} from '@evmos/provider';
import { ValidatorListItemDesktop } from '../validator-list-item-desktop/validator-list-item-desktop';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { randomSort } from '@haqq/staking/utils';
import { formatNumber } from '@haqq/shell-ui-kit';
import clsx from 'clsx';
import store from 'store2';
import { useAddress } from '@haqq/shared';

export type SortDirection = 'asc' | 'desc' | undefined;

export interface SortState {
  key: string | undefined;
  direction: SortDirection;
}

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
}: {
  validators: Validator[];
  rewardsInfo: DistributionRewardsResponse | null | undefined;
  delegationInfo: GetDelegationsResponse | null | undefined;
  onValidatorClick: (validatorAddress: string) => void;
  totalStaked: number;
}) {
  const { ethAddress } = useAddress();
  const storeKey = `validators_sort_state_${ethAddress}`;
  const storedSortState: string | null = store.get(storeKey);
  const defaultSortState: SortState = storedSortState
    ? JSON.parse(storedSortState)
    : {
        key: undefined,
        direction: undefined,
      };
  const [sortStates, setSortStates] = useState<SortState>(defaultSortState);
  const [vals, setVals] = useState<Validator[]>([]);

  useEffect(() => {
    setVals(randomSort(validators));
  }, [validators]);

  useEffect(() => {
    store.set(storeKey, JSON.stringify(sortStates));
  }, [sortStates, storeKey]);

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

  const getSortedValidators = useCallback(
    (validators: Validator[], state: SortState) => {
      const sortedValidators: Validator[] = [...validators];

      switch (sortStates.key) {
        case 'name':
          sortedValidators.sort((a, b) => {
            return a.description.moniker.localeCompare(b.description.moniker);
          });
          break;

        case 'status':
          sortedValidators.sort((a, b) => {
            return a.jailed === b.jailed ? 0 : a.jailed ? 1 : -1;
          });
          break;

        case 'fee':
          sortedValidators.sort((a, b) => {
            return (
              Number.parseFloat(b.commission.commission_rates.rate) -
              Number.parseFloat(a.commission.commission_rates.rate)
            );
          });
          break;

        case 'votingPower':
          sortedValidators.sort((a, b) => {
            return Number.parseFloat(b.tokens) - Number.parseFloat(a.tokens);
          });
          break;

        case 'votingPowerPercent':
          sortedValidators.sort((a, b) => {
            return (
              (Number.parseFloat(b.tokens) / totalStaked) * 100 -
              (Number.parseFloat(a.tokens) / totalStaked) * 100
            );
          });
          break;

        case 'staked':
          sortedValidators.sort((a, b) => {
            const aDelegation = getDelegationInfo(a.operator_address);
            const bDelegation = getDelegationInfo(b.operator_address);

            const aAmount = Number.parseFloat(
              formatNumber(
                Number.parseFloat(aDelegation?.balance.amount || '0'),
              ),
            );
            const bAmount = Number.parseFloat(
              formatNumber(
                Number.parseFloat(bDelegation?.balance.amount || '0'),
              ),
            );

            return bAmount - aAmount;
          });
          break;

        case 'reward':
          sortedValidators.sort((a, b) => {
            const aRewards = getValidatorRewards(a.operator_address);
            const bRewards = getValidatorRewards(b.operator_address);

            const aReward = aRewards?.reward[0]?.amount ?? 0;
            const bReward = bRewards?.reward[0]?.amount ?? 0;

            return Number(bReward) - Number(aReward);
          });
          break;

        default:
          break;
      }

      if (state.direction === 'desc') {
        sortedValidators.reverse();
      }

      return sortedValidators;
    },
    [sortStates.key, totalStaked, getDelegationInfo, getValidatorRewards],
  );

  const handleSortClick = useCallback(
    (key: string) => {
      if (key !== sortStates.key) {
        setSortStates({
          key,
          direction: sortStates.direction,
        });
      } else {
        setSortStates({
          key,
          direction: sortStates.direction === 'asc' ? 'desc' : 'asc',
        });
      }
    },
    [sortStates],
  );

  const valsToRender = useMemo(() => {
    let resultVals: Validator[];

    if (sortStates.key === undefined) {
      resultVals = vals;
    } else {
      resultVals = getSortedValidators(vals, sortStates);
    }

    return [
      ...resultVals.filter((val) => {
        return !val.jailed;
      }),
      ...resultVals.filter((val) => {
        return val.jailed;
      }),
    ];
  }, [getSortedValidators, sortStates, vals]);

  return (
    <table className="w-full table-auto">
      <thead className="text-[10px] uppercase leading-[1.2em] text-white/50 md:text-[12px]">
        <tr>
          <th className="p-[8px] text-left lg:p-[12px]">
            <div
              className={clsx(
                'relative inline-block cursor-pointer select-none',
                sortStates.direction !== undefined &&
                  sortStates.key === 'name' &&
                  'text-white',
              )}
              onClick={() => {
                handleSortClick('name');
              }}
            >
              Name
              {sortStates.key === 'name' && (
                <SortDirectionArrow direction={sortStates.direction} />
              )}
            </div>
          </th>
          <th className="p-[8px] text-left lg:p-[12px]">
            <div className="select-none">
              Status
              {sortStates.key === 'status' && (
                <SortDirectionArrow direction={sortStates.direction} />
              )}
            </div>
          </th>
          <th className="p-[8px] text-right lg:p-[12px]">
            <div
              className={clsx(
                'relative inline-block cursor-pointer select-none',
                sortStates.direction !== undefined &&
                  sortStates.key === 'fee' &&
                  'text-white',
              )}
              onClick={() => {
                handleSortClick('fee');
              }}
            >
              Fee
              {sortStates.key === 'fee' && (
                <SortDirectionArrow direction={sortStates.direction} />
              )}
            </div>
          </th>
          <th className="p-[8px] text-right lg:p-[12px]">
            <div
              className={clsx(
                'relative inline-block cursor-pointer select-none',
                sortStates.direction !== undefined &&
                  sortStates.key === 'votingPower' &&
                  'text-white',
              )}
              onClick={() => {
                handleSortClick('votingPower');
              }}
            >
              Voting power
              {sortStates.key === 'votingPower' && (
                <SortDirectionArrow direction={sortStates.direction} />
              )}
            </div>
          </th>
          <th className="p-[8px] text-right lg:p-[12px]">
            <div
              className={clsx(
                'relative inline-block cursor-pointer select-none',
                sortStates.direction !== undefined &&
                  sortStates.key === 'votingPowerPercent' &&
                  'text-white',
              )}
              onClick={() => {
                handleSortClick('votingPowerPercent');
              }}
            >
              Voting power %
              {sortStates.key === 'votingPowerPercent' && (
                <SortDirectionArrow direction={sortStates.direction} />
              )}
            </div>
          </th>
          <th className="p-[8px] text-right lg:p-[12px]">
            <div
              className={clsx(
                'relative inline-block cursor-pointer select-none',
                sortStates.direction !== undefined &&
                  sortStates.key === 'staked' &&
                  'text-white',
              )}
              onClick={() => {
                handleSortClick('staked');
              }}
            >
              My stake
              {sortStates.key === 'staked' && (
                <SortDirectionArrow direction={sortStates.direction} />
              )}
            </div>
          </th>
          <th className="p-[8px] text-right lg:p-[12px]">
            <div
              className={clsx(
                'relative inline-block cursor-pointer select-none',
                sortStates.direction !== undefined &&
                  sortStates.key === 'reward' &&
                  'text-white',
              )}
              onClick={() => {
                handleSortClick('reward');
              }}
            >
              My rewards
              {sortStates.key === 'reward' && (
                <SortDirectionArrow direction={sortStates.direction} />
              )}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {valsToRender.map((validator, index) => {
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
