import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, Heading, SpinnerLoader } from '@haqq/shell-ui-kit';
import {
  useAddress,
  useStakingDelegationQuery,
  useStakingRewardsQuery,
  useStakingValidatorListQuery,
  useStakingPoolQuery,
} from '@haqq/shared';
import {
  GetDelegationsResponse,
  Validator,
  DistributionRewardsResponse,
} from '@evmos/provider';
import { ValidatorListStatus } from '@haqq/staking/ui-kit';
import { bondStatusFromJSON } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { formatUnits } from 'viem';

interface DelegationListValidator {
  name: string;
  address: string;
  status: string;
  jailed: boolean;
  fee: string;
  power: string;
  staked: string;
  rewards: string;
}

export function ValidatorWithDelegationListItem({
  validator,
  stakingPool,
}: {
  validator: DelegationListValidator;
  stakingPool: number;
}) {
  const validatorCommission = useMemo(() => {
    return (Number.parseFloat(validator.fee ?? '0') * 100).toFixed(0);
  }, [validator.fee]);
  const votingPower = useMemo(() => {
    return Number.parseInt(validator.power ?? '0') / 10 ** 18;
  }, [validator.power]);

  const votingPowerInPercents = useMemo(() => {
    return ((votingPower / stakingPool) * 100).toFixed(2);
  }, [votingPower, stakingPool]);
  const userDelegate = useMemo(() => {
    return Number.parseFloat(formatUnits(BigInt(validator.staked), 18));
  }, [validator.staked]);
  const userRewards = useMemo(() => {
    return Number.parseFloat(validator.rewards) / 10 ** 18;
  }, [validator.rewards]);

  return (
    <Link
      to={`staking/validator/${validator.address}`}
      className="hover:bg-islamic-black-100/10 dark:hover:bg-islamic-black-500/10 border-islamic-black-100/20 block cursor-pointer border-b px-6 py-4 transition-[background] duration-75 last:border-b-0"
    >
      <div className="flex items-center justify-between space-x-6">
        <div className="w-1/4">
          <div>{validator.name}</div>
        </div>

        <div className="w-[80px] text-center">
          <ValidatorListStatus
            jailed={validator.jailed}
            status={bondStatusFromJSON(validator.status)}
          />
        </div>
        <div className="w-[50px] text-center">{validatorCommission}%</div>
        <div className="flex-1 text-right font-semibold">
          <div>{votingPower.toLocaleString()}</div>
          <div className="text-sm text-gray-400">{votingPowerInPercents}%</div>
        </div>
        <div className="flex-1 text-right">{userDelegate.toLocaleString()}</div>
        <div className="flex-1 text-right">{userRewards.toLocaleString()}</div>
      </div>
    </Link>
  );
}

function mapAndSortValidators(
  valArr: Validator[],
  delegations: GetDelegationsResponse,
  rewards: DistributionRewardsResponse,
) {
  const delegatedVals = delegations.delegation_responses
    .map((del) => {
      if (Number.parseInt(del.balance.amount, 10) > 0) {
        return del.delegation.validator_address;
      }

      return null;
    })
    .filter(Boolean);
  const valsWithDelegation = valArr
    .filter((val) => {
      return delegatedVals.includes(val.operator_address);
    })
    .map((val) => {
      const staked = delegations.delegation_responses.find((del) => {
        return del.delegation.validator_address === val.operator_address;
      });
      const rewardAmount = rewards.rewards.find((rew) => {
        return rew.validator_address === val.operator_address;
      });

      return {
        name: val.description.moniker,
        address: val.operator_address,
        status: val.status,
        fee: val.commission.commission_rates.rate,
        power: val.tokens,
        jailed: val.jailed,
        staked: staked?.balance?.amount ?? '0',
        rewards: rewardAmount?.reward[0]?.amount ?? '0',
      };
    })
    .sort((valA, valB) => {
      return (
        Number.parseInt(valB.staked, 10) - Number.parseInt(valA.staked, 10)
      );
    });

  return valsWithDelegation;
}

export function ShellIndexPageDelegationList() {
  const { haqqAddress } = useAddress();
  const {
    data: validatorsList,
    error,
    status,
  } = useStakingValidatorListQuery(1000);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const { data: stakingPool } = useStakingPoolQuery();

  const validatorsWithDelegation = useMemo(() => {
    if (!(validatorsList?.length && delegationInfo && rewardsInfo)) {
      return [];
    }

    return mapAndSortValidators(validatorsList, delegationInfo, rewardsInfo);
  }, [delegationInfo, rewardsInfo, validatorsList]);

  const totalStaked = useMemo(() => {
    return Number.parseInt(stakingPool?.pool.bonded_tokens ?? '0') / 10 ** 18;
  }, [stakingPool?.pool.bonded_tokens]);

  if (!haqqAddress) {
    return (
      <Card className="flex min-h-[293px] flex-row items-center justify-center !p-0">
        <div>You should connect wallet first</div>
      </Card>
    );
  }

  return (
    <div>
      <Card className="flex flex-1 flex-col !p-0">
        <div className="border-islamic-black-100/20 border-b px-6 py-3">
          <div className="flex items-center justify-between space-x-6 font-semibold">
            <div className="w-1/4">
              <div className="font-semibold">Name</div>
            </div>
            <div className="w-[80px] text-center">Status</div>
            <div className="w-[50px] text-center">Fee</div>
            <div className="flex-1 text-right">Voting power</div>
            <div className="flex-1 text-right">Staked</div>
            <div className="flex-1 text-right">Rewards</div>
          </div>
        </div>

        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center space-y-8 p-20">
            <SpinnerLoader />
            <div className="block text-base">Fetching validators list</div>
          </div>
        )}
        {status === 'error' && <p>Error: {(error as any).message}</p>}
        {status === 'success' && (
          <div className="max-h-[300px] min-h-[120px] w-full overflow-y-scroll">
            {validatorsWithDelegation?.length ? (
              validatorsWithDelegation.map((validator, index) => {
                return (
                  <ValidatorWithDelegationListItem
                    validator={validator}
                    key={`validator-${index}`}
                    stakingPool={totalStaked}
                  />
                );
              })
            ) : (
              <div className="pt-[64px] text-center">
                <Heading level={3}>You don't have active delegations</Heading>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
