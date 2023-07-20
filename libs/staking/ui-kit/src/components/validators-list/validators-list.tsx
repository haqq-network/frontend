import { useCallback, useEffect, useMemo, useState } from 'react';
import { ValidatorListItem } from '../validator-list-item/validator-list-item';
import type {
  DistributionRewardsResponse,
  GetDelegationsResponse,
  Validator,
} from '@evmos/provider';
import { useStakingPoolQuery } from '@haqq/shared';
import { ValidatorListItemMobile as ValidatorListItemMobileComponent } from '@haqq/shell-ui-kit';
import { ValidatorListItemProps } from '../validator-list-item/validator-list-item';
import { formatUnits } from 'viem/utils';
import { randomSort } from '@haqq/staking/utils';
import clsx from 'clsx';

export function ValidatorListItemMobile({
  validator,
  reward,
  delegation,
  stakingPool,
  onClick,
}: ValidatorListItemProps) {
  const validatorCommission = useMemo(() => {
    return (
      Number.parseFloat(validator.commission?.commission_rates?.rate ?? '0') *
      100
    ).toFixed(0);
  }, [validator.commission?.commission_rates]);
  const votingPower = useMemo(() => {
    return Number.parseInt(validator.tokens ?? '0') / 10 ** 18;
  }, [validator.tokens]);
  const userDelegate = useMemo(() => {
    if (delegation?.balance) {
      return Number.parseFloat(
        formatUnits(BigInt(delegation.balance.amount), 18),
      );
    }

    return 0;
  }, [delegation]);
  const userRewards = useMemo(() => {
    if (reward?.reward.length) {
      return Number.parseFloat(reward?.reward[0].amount) / 10 ** 18;
    }

    return 0;
  }, [reward]);

  const votingPowerInPercents = useMemo(() => {
    return ((votingPower / stakingPool) * 100).toFixed(2);
  }, [votingPower, stakingPool]);

  return (
    <div
      onClick={() => {
        onClick(validator.operator_address);
      }}
    >
      <ValidatorListItemMobileComponent
        validatorName={validator.description.moniker}
        fee={`${validatorCommission}%`}
        reward={userRewards}
        staked={userDelegate}
        votingPowerPercent={votingPowerInPercents}
        votingPower={votingPower}
        status="active"
      />
    </div>
  );
}

interface ValidatorListProps {
  validators: Validator[];
  rewardsInfo: DistributionRewardsResponse | null | undefined;
  delegationInfo: GetDelegationsResponse | null | undefined;
  onValidatorClick: (validatorAddress: string) => void;
}

type SortDirection = 'asc' | 'desc' | undefined;

interface SortState {
  key: string | undefined;
  direction: SortDirection;
}

export function ValidatorsListMobile({
  validators,
  rewardsInfo,
  delegationInfo,
  onValidatorClick,
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
    return Number.parseInt(stakingPool?.bonded_tokens ?? '0') / 10 ** 18;
  }, [stakingPool?.bonded_tokens]);

  return (
    <div className="divide-haqq-border flex flex-col divide-y divide-solid">
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

function SortDirectionArrow({ direction }: { direction: SortDirection }) {
  if (!direction) {
    return null;
  }

  return <span> {direction === 'asc' ? '▼' : '▲'}</span>;
}

export function ValidatorsList({
  validators,
  rewardsInfo,
  delegationInfo,
  onValidatorClick,
}: ValidatorListProps) {
  const [sortStates, setSortStates] = useState<SortState>({
    key: undefined,
    direction: undefined,
  });

  const [vals, setVals] = useState<Validator[]>([]);

  useEffect(() => {
    setVals(randomSort(validators));
  }, [validators]);

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
    return Number.parseInt(stakingPool?.bonded_tokens ?? '0') / 10 ** 18;
  }, [stakingPool?.bonded_tokens]);

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
              parseFloat(a.commission.commission_rates.rate) -
              parseFloat(b.commission.commission_rates.rate)
            );
          });
          break;

        case 'votingPower':
          sortedValidators.sort((a, b) => {
            return parseFloat(b.tokens) - parseFloat(a.tokens);
          });
          break;

        case 'votingPowerPercent':
          sortedValidators.sort((a, b) => {
            return (
              (parseFloat(b.tokens) / totalStaked) * 100 -
              (parseFloat(a.tokens) / totalStaked) * 100
            );
          });
          break;

        case 'staked':
          sortedValidators.sort((a, b) => {
            const aDelegation = getDelegationInfo(a.operator_address);
            const bDelegation = getDelegationInfo(b.operator_address);

            const aAmount = parseFloat(aDelegation?.balance.amount || '0');
            const bAmount = parseFloat(bDelegation?.balance.amount || '0');

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

  const handleSortClick = useCallback((key: string) => {
    setSortStates((prev) => {
      let newDirection: SortDirection;

      if (prev.key === key) {
        newDirection =
          prev.direction === 'asc'
            ? 'desc'
            : prev.direction === 'desc'
            ? undefined
            : 'asc';
      } else {
        newDirection = 'asc';
      }

      return {
        key: newDirection === undefined ? undefined : key,
        direction: newDirection,
      };
    });
  }, []);

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
    <table className="w-full table-auto md:table-fixed">
      <thead className="text-[10px] uppercase leading-[1.2em] text-white/50 md:text-[12px]">
        <tr>
          <th
            className={clsx(
              'cursor-pointer select-none p-[8px] text-left lg:p-[12px]',
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
          </th>
          <th className="cursor-pointer select-none p-[8px] text-left lg:p-[12px]">
            Status
            {sortStates.key === 'status' && (
              <SortDirectionArrow direction={sortStates.direction} />
            )}
          </th>
          <th
            className={clsx(
              'cursor-pointer select-none p-[8px] text-left lg:p-[12px]',
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
          </th>
          <th
            className={clsx(
              'cursor-pointer select-none p-[8px] text-right lg:p-[12px]',
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
          </th>
          <th
            className={clsx(
              'cursor-pointer select-none p-[8px] text-right lg:p-[12px]',
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
          </th>
          <th
            className={clsx(
              'cursor-pointer select-none p-[8px] text-right lg:p-[12px]',
              sortStates.direction !== undefined &&
                sortStates.key === 'staked' &&
                'text-white',
            )}
            onClick={() => {
              handleSortClick('staked');
            }}
          >
            Staked
            {sortStates.key === 'staked' && (
              <SortDirectionArrow direction={sortStates.direction} />
            )}
          </th>
          <th
            className={clsx(
              'cursor-pointer select-none p-[8px] text-right lg:p-[12px]',
              sortStates.direction !== undefined &&
                sortStates.key === 'reward' &&
                'text-white',
            )}
            onClick={() => {
              handleSortClick('reward');
            }}
          >
            Reward
            {sortStates.key === 'reward' && (
              <SortDirectionArrow direction={sortStates.direction} />
            )}
          </th>
        </tr>
      </thead>
      <tbody>
        {valsToRender.map((validator, index) => {
          const delegationInfo = getDelegationInfo(validator.operator_address);
          const rewardsInfo = getValidatorRewards(validator.operator_address);

          return (
            <ValidatorListItem
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
