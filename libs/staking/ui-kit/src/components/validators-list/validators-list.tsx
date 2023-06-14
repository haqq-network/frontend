import { useCallback, useEffect, useMemo, useState } from 'react';
import { ValidatorListItem } from '../validator-list-item/validator-list-item';
import type {
  DistributionRewardsResponse,
  GetDelegationsResponse,
  Validator,
} from '@evmos/provider';
import { useStakingPoolQuery } from '@haqq/shared';
import { ValidatorListItemMobile as ValidatorListItemMobileComponent } from '@haqq/shell/ui-kit';
import { ValidatorListItemProps } from '../validator-list-item/validator-list-item';
import { formatUnits } from 'ethers/lib/utils';
import { randomSort } from '@haqq/staking/utils';

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
      return Number.parseFloat(formatUnits(delegation.balance.amount));
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

type SortDirection = 'asc' | 'desc' | 'default';

type SortType =
  | 'name'
  | 'status'
  | 'fee'
  | 'votingPower'
  | 'votingPowerPercent'
  | 'staked'
  | 'reward';

type SortStates = {
  [key in SortType]: SortDirection;
};

function shuffleValidators(arr: Validator[]): Validator[] {
  const shuffledArray = [...arr];
  const activeItems = shuffledArray.filter((item) => {
    return !item.jailed;
  });
  const jailedItems = shuffledArray.filter((item) => {
    return item.jailed;
  });

  const sortedArray = [...activeItems, ...jailedItems];

  for (let i = sortedArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [sortedArray[i], sortedArray[randomIndex]] = [
      sortedArray[randomIndex],
      sortedArray[i],
    ];
  }

  return sortedArray;
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
    return Number.parseInt(stakingPool?.pool.bonded_tokens ?? '0') / 10 ** 18;
  }, [stakingPool?.pool.bonded_tokens]);

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

export function ValidatorsList({
  validators,
  rewardsInfo,
  delegationInfo,
  onValidatorClick,
}: ValidatorListProps) {
  const [valsState, setValidators] = useState(validators);
  const [sortStates, setSortStates] = useState<{
    [key in SortType]: SortDirection;
  }>({
    name: 'default',
    status: 'default',
    fee: 'default',
    votingPower: 'default',
    votingPowerPercent: 'default',
    staked: 'default',
    reward: 'default',
  });

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

  const handleSortClick = useCallback(
    (sortBy: SortType) => {
      const newSortStates: SortStates = { ...sortStates };

      Object.keys(newSortStates).forEach((key) => {
        if (key !== sortBy) {
          newSortStates[key as SortType] = 'default';
        }
      });

      if (newSortStates[sortBy as SortType] === 'asc') {
        newSortStates[sortBy as SortType] = 'desc';
      } else if (newSortStates[sortBy as SortType] === 'desc') {
        newSortStates[sortBy as SortType] = 'default';
      } else {
        newSortStates[sortBy as SortType] = 'asc';
      }

      const sortedValidators: Validator[] = [...validators];

      if (newSortStates[sortBy as SortType] !== 'default') {
        switch (sortBy) {
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

        if (newSortStates[sortBy as SortType] === 'desc') {
          sortedValidators.reverse();
        }
      }

      setSortStates(newSortStates);
      setValidators(sortedValidators);
    },
    [
      sortStates,
      validators,
      totalStaked,
      getDelegationInfo,
      getValidatorRewards,
    ],
  );

  useEffect(() => {
    const shuffledValidators = randomSort(validators);
    setValidators(shuffledValidators);
  }, [validators]);

  return (
    <table className="w-full table-auto lg:table-fixed">
      <thead className="text-[10px] uppercase leading-[1.2em] text-white/50 md:text-[12px]">
        <tr>
          <th
            className="p-[8px] text-left lg:p-[12px]"
            onClick={() => {
              return handleSortClick('name');
            }}
          >
            Name
            {sortStates['name'] === 'asc' && ' ▲'}
            {sortStates['name'] === 'desc' && ' ▼'}
          </th>
          <th
            className="p-[8px] text-left lg:p-[12px]"
            onClick={() => {
              return handleSortClick('status');
            }}
          >
            Status
            {sortStates['status'] === 'asc' && ' ▲'}
            {sortStates['status'] === 'desc' && ' ▼'}
          </th>
          <th
            className="p-[8px] text-left lg:p-[12px]"
            onClick={() => {
              return handleSortClick('fee');
            }}
          >
            Fee
            {sortStates['fee'] === 'asc' && ' ▲'}
            {sortStates['fee'] === 'desc' && ' ▼'}
          </th>
          <th
            className="p-[8px] text-right lg:p-[12px]"
            onClick={() => {
              return handleSortClick('votingPower');
            }}
          >
            {sortStates['votingPower'] === 'asc' && ' ▲'}
            {sortStates['votingPower'] === 'desc' && ' ▼'}
            Voting power
          </th>
          <th
            className="p-[8px] text-right lg:p-[12px]"
            onClick={() => {
              return handleSortClick('votingPowerPercent');
            }}
          >
            {sortStates['votingPowerPercent'] === 'asc' && ' ▲'}
            {sortStates['votingPowerPercent'] === 'desc' && ' ▼'}
            Voting power %
          </th>
          <th
            className="p-[8px] text-right lg:p-[12px]"
            onClick={() => {
              return handleSortClick('staked');
            }}
          >
            {sortStates['staked'] === 'asc' && ' ▲'}
            {sortStates['staked'] === 'desc' && ' ▼'}
            Staked
          </th>
          <th
            className="p-[8px] text-right lg:p-[12px]"
            onClick={() => {
              return handleSortClick('reward');
            }}
          >
            {sortStates['reward'] === 'asc' && ' ▲'}
            {sortStates['reward'] === 'desc' && ' ▼'}
            Reward
          </th>
        </tr>
      </thead>
      <tbody>
        {valsState.map((validator, index) => {
          const delegationInfo = getDelegationInfo(validator.operator_address);
          const rewardsInfo = getValidatorRewards(validator.operator_address);
          console.log({ rewardsInfo });

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
