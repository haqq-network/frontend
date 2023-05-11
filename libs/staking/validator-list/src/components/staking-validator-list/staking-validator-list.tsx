import { Fragment, useCallback, useMemo } from 'react';
import {
  useAddress,
  useStakingValidatorListQuery,
  useStakingRewardsQuery,
  useStakingDelegationQuery,
} from '@haqq/shared';
import { StakingInfo, ValidatorsList } from '@haqq/staking/ui-kit';
import { sortValidatorsByToken, splitValidators } from '@haqq/staking/utils';
import { Validator } from '@evmos/provider';
import { ValidatorIcon, Heading, SpinnerLoader } from '@haqq/shell/ui-kit-next';

export function StakingValidatorList() {
  const { haqqAddress } = useAddress();
  const {
    data: validatorsList,
    error,
    status,
  } = useStakingValidatorListQuery(1000);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);

  const getValidatorRewards = useCallback(
    (address: string) => {
      const rewards = rewardsInfo?.rewards?.find((rewardsItem: any) => {
        return rewardsItem.validator_address === address;
      });

      return rewards;
    },
    [rewardsInfo?.rewards],
  );

  const sortedValidators = useMemo(() => {
    const { active, inactive, jailed } = splitValidators(validatorsList ?? []);

    return [
      ...sortValidatorsByToken(active),
      ...sortValidatorsByToken(inactive),
      ...sortValidatorsByToken(jailed),
    ];
  }, [validatorsList]);

  const [delegatedValidators, otherValidators] = useMemo(() => {
    if (sortedValidators.length === 0) {
      return [[], []] as [Validator[], Validator[]];
    }

    const delegated: Validator[] = [];
    const others: Validator[] = [];

    for (const validator of sortedValidators) {
      const rewardsInfo = getValidatorRewards(validator.operator_address);
      if (rewardsInfo) {
        delegated.push(validator);
      } else {
        others.push(validator);
      }
    }

    return [delegated, others];
  }, [getValidatorRewards, sortedValidators]);

  return (
    <Fragment>
      <section className="flex flex-col w-full px-[16px] sm:px-[63px] lg:px-[79px] lg:py-[68px]">
        <div className="font-serif text-[28px] sm:text-[48px] lg:text-[70px] uppercase leading-none">
          Staking
        </div>
      </section>

      <StakingInfo />

      <section className="flex flex-col w-full px-[16px] sm:px-[63px] lg:px-[79px] lg:py-[68px]">
        <div className="mb-[32px] flex flex-row items-center">
          <ValidatorIcon />
          <Heading level={3} className="ml-[8px]">
            Validators
          </Heading>
        </div>

        <div>
          {status === 'loading' && (
            <div className="mx-auto w-full max-w-6xl flex-1 flex select-none pointer-events-none py-20">
              <div className="flex-1 flex flex-col space-y-8 items-center justify-center min-h-full">
                <SpinnerLoader />
                <div className="font-sans text-[10px] leading-[1.2em] uppercase">
                  Fetching validators list
                </div>
              </div>
            </div>
          )}
          {status === 'error' && <p>Error: {error.message}</p>}
          {status === 'success' && (
            <div className="flex flex-col gap-[24px]">
              {delegatedValidators.length && (
                <div>
                  <div className="text-[20px] leading-[26px] text-white/50 font-serif mb-[8px]">
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
                <div className="text-[20px] leading-[26px] text-white/50 font-serif mb-[8px]">
                  Other validators
                </div>
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
