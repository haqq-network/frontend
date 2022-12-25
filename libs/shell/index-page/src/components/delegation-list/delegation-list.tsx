import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, Heading, SpinnerLoader, Text } from '@haqq/ui-kit';
import {
  useAddress,
  useStakingDelegationQuery,
  useStakingRewardsQuery,
  useStakingValidatorListQuery,
} from '@haqq/shared';
import {
  GetDelegationsResponse,
  Validator,
  DistributionRewardsResponse,
} from '@evmos/provider';
import { formatUnits } from 'ethers/lib/utils';
import { ValidatorStatus } from '@haqq/staking/ui-kit';
import { bondStatusFromJSON } from 'cosmjs-types/cosmos/staking/v1beta1/staking';

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
        staked: staked?.balance.amount ?? '0',
        rewards: rewardAmount?.reward[0].amount ?? '0',
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

  const validatorsWithDelegation = useMemo(() => {
    if (!(validatorsList?.length && delegationInfo && rewardsInfo)) {
      return [];
    }

    return mapAndSortValidators(validatorsList, delegationInfo, rewardsInfo);
  }, [delegationInfo, rewardsInfo, validatorsList]);

  return (
    <div>
      <Card className="!p-0 flex flex-col flex-1">
        <div className="px-6 py-3 border-b border-islamic-black-100/20">
          <div className="flex items-center justify-between space-x-6 font-semibold">
            <div className="w-1/3">
              <div className="font-semibold">Name</div>
            </div>
            <div className="w-[100px] text-center">Status</div>
            <div className="w-[50px] text-center">Fee</div>
            <div className="flex-1 text-right">Power</div>
            <div className="flex-1 text-right">Staked</div>
            <div className="flex-1 text-right">Rewards</div>
          </div>
        </div>

        {status === 'loading' && (
          <div className="flex flex-col space-y-8 items-center justify-center p-20">
            <SpinnerLoader />
            <Text block>Fetching validators list</Text>
          </div>
        )}
        {status === 'error' && <p>Error: {(error as any).message}</p>}
        {status === 'success' && (
          <div className="overflow-y-scroll w-full min-h-[120px] max-h-[300px]">
            {validatorsWithDelegation?.length ? (
              validatorsWithDelegation.map((validator, index) => {
                return (
                  <Link
                    to={`staking/validator/${validator.address}`}
                    key={`validator-${index}`}
                  >
                    <ValidatorWithDelegationListItem validator={validator} />
                  </Link>
                );
              })
            ) : (
              <div className="text-center pt-[64px]">
                <Heading level={3}>There's no data</Heading>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export function ValidatorWithDelegationListItem({
  validator,
}: {
  validator: DelegationListValidator;
}) {
  const validatorCommission = useMemo(() => {
    return (Number.parseFloat(validator.fee ?? '0') * 100).toFixed(0);
  }, [validator.fee]);
  const votingPower = useMemo(() => {
    return Number.parseInt(validator.power ?? '0') / 10 ** 18;
  }, [validator.power]);
  const userDelegate = useMemo(() => {
    return Number.parseFloat(formatUnits(validator.staked));
  }, [validator.staked]);
  const userRewards = useMemo(() => {
    return Number.parseFloat(validator.rewards) / 10 ** 18;
  }, [validator.rewards]);

  return (
    <div className="px-6 py-4 hover:bg-islamic-black-100/10 dark:hover:bg-islamic-black-500/20 border-b border-islamic-black-100/20 cursor-pointer transition-[background] duration-75">
      <div className="flex items-center justify-between space-x-6">
        <div className="w-1/3">
          <div>{validator.name}</div>
        </div>

        <div className="w-[100px] text-center">
          <ValidatorStatus
            jailed={validator.jailed}
            status={bondStatusFromJSON(validator.status)}
          />
        </div>
        <div className="w-[50px] text-center">{validatorCommission}%</div>
        <div className="flex-1 text-right font-semibold">
          {votingPower.toLocaleString()}
        </div>
        <div className="flex-1 text-right">{userDelegate.toLocaleString()}</div>
        <div className="flex-1 text-right">{userRewards.toLocaleString()}</div>
      </div>
    </div>
  );
}
