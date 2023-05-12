import { Fragment, useMemo } from 'react';
import {
  useAddress,
  useStakingValidatorListQuery,
  useStakingRewardsQuery,
  useStakingDelegationQuery,
} from '@haqq/shared';
import { StakingInfo, ValidatorsList } from '@haqq/staking/ui-kit';
import { sortValidatorsByToken, splitValidators } from '@haqq/staking/utils';
import { Validator, DelegationResponse } from '@evmos/provider';
import { ValidatorIcon, Heading, SpinnerLoader } from '@haqq/shell/ui-kit';

function getDelegatedValidatorsAddresses(
  delegations: DelegationResponse[] | null | undefined,
) {
  if (!delegations) {
    return [];
  }

  return delegations
    .map((del) => {
      if (Number.parseInt(del.balance.amount, 10) > 0) {
        return del.delegation.validator_address;
      }

      return null;
    })
    .filter(Boolean);
}

export function StakingValidatorList() {
  const { haqqAddress } = useAddress();
  const {
    data: validatorsList,
    error,
    status,
  } = useStakingValidatorListQuery(1000);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);

  const sortedValidators = useMemo(() => {
    const { active, inactive, jailed } = splitValidators(validatorsList ?? []);

    return [
      ...sortValidatorsByToken(active),
      ...sortValidatorsByToken(inactive),
      ...sortValidatorsByToken(jailed),
    ];
  }, [validatorsList]);

  const valWithDelegationAddr = useMemo(() => {
    if (!delegationInfo || !haqqAddress) {
      return [];
    }
    const delegatedVals = getDelegatedValidatorsAddresses(
      delegationInfo.delegation_responses,
    );
    return delegatedVals;
  }, [delegationInfo, haqqAddress]);

  const [delegatedValidators, otherValidators] = useMemo(() => {
    if (sortedValidators.length === 0) {
      return [[], []] as [Validator[], Validator[]];
    }

    const delegated: Validator[] = [];
    const others: Validator[] = [];

    for (const validator of sortedValidators) {
      const hasDelegation = valWithDelegationAddr.includes(
        validator.operator_address,
      );

      if (hasDelegation) {
        delegated.push(validator);
      } else {
        others.push(validator);
      }
    }

    return [delegated, others];
  }, [sortedValidators, valWithDelegationAddr]);

  return (
    <Fragment>
      <section className="flex w-full flex-col px-[16px] sm:px-[63px] lg:px-[79px] lg:py-[68px]">
        <div className="font-serif text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
          Staking
        </div>
      </section>

      <StakingInfo />

      <section className="flex w-full flex-col px-[16px] sm:px-[63px] lg:px-[79px] lg:py-[68px]">
        <div className="mb-[32px] flex flex-row items-center">
          <ValidatorIcon />
          <Heading level={3} className="ml-[8px]">
            Validators
          </Heading>
        </div>

        <div>
          {status === 'loading' && (
            <div className="pointer-events-none mx-auto flex w-full max-w-6xl flex-1 select-none py-20">
              <div className="flex min-h-full flex-1 flex-col items-center justify-center space-y-8">
                <SpinnerLoader />
                <div className="font-sans text-[10px] uppercase leading-[1.2em]">
                  Fetching validators list
                </div>
              </div>
            </div>
          )}
          {status === 'error' && <p>Error: {error.message}</p>}
          {status === 'success' && (
            <div className="flex flex-col gap-[24px]">
              {delegatedValidators.length !== 0 && (
                <div>
                  <div className="border-haqq-border border-b border-dashed pb-[8px] font-serif text-[20px] leading-[26px] text-white/50">
                    My delegations
                  </div>
                  <ValidatorsList
                    validators={delegatedValidators}
                    delegationInfo={delegationInfo}
                    rewardsInfo={rewardsInfo}
                  />
                </div>
              )}
              <div>
                {delegatedValidators.length !== 0 && (
                  <div className="border-haqq-border border-b border-dashed pb-[8px] font-serif text-[20px] leading-[26px] text-white/50">
                    Other validators
                  </div>
                )}
                <ValidatorsList
                  validators={otherValidators}
                  delegationInfo={delegationInfo}
                  rewardsInfo={rewardsInfo}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </Fragment>
  );
}
