import { useMemo } from 'react';
import {
  useAddress,
  useStakingDelegationQuery,
  useStakingPoolQuery,
  useStakingRewardsQuery,
  useStakingValidatorListQuery,
} from '@haqq/shared';
import {
  Container,
  Heading,
  ListIcon,
  OrangeLink,
  SpinnerLoader,
} from '@haqq/shell/ui-kit';
import { ValidatorsList, ValidatorsListMobile } from '@haqq/staking/ui-kit';
import { DelegationResponse } from '@evmos/provider';
import { sortValidatorsByToken, splitValidators } from '@haqq/staking/utils';
import { useMediaQuery } from 'react-responsive';

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

export function DelegationsBlock() {
  const { haqqAddress } = useAddress();
  const {
    data: validatorsList,
    error,
    status,
  } = useStakingValidatorListQuery(1000);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const isMobile = useMediaQuery({
    query: `(max-width: 639px)`,
  });

  const sortedValidators = useMemo(() => {
    const { active, inactive, jailed } = splitValidators(validatorsList ?? []);

    return [
      ...sortValidatorsByToken(active),
      ...sortValidatorsByToken(inactive),
      ...sortValidatorsByToken(jailed),
    ];
  }, [validatorsList]);
  const valWithDelegationAddr = useMemo(() => {
    const delegatedVals = getDelegatedValidatorsAddresses(
      delegationInfo?.delegation_responses,
    );
    return delegatedVals;
  }, [delegationInfo]);
  const valToRender = useMemo(() => {
    return sortedValidators.filter((val) => {
      return valWithDelegationAddr.includes(val.operator_address);
    });
  }, [sortedValidators, valWithDelegationAddr]);

  return (
    <Container>
      <div className="mb-[24px] flex flex-row items-center">
        <ListIcon />
        <Heading level={3} className="ml-[8px]">
          My delegations
        </Heading>
      </div>

      <div>
        {status === 'loading' && (
          <div className="pointer-events-none mx-auto flex min-h-[220px] w-full flex-1 select-none">
            <div className="flex min-h-full flex-1 flex-col items-center justify-center space-y-8">
              <SpinnerLoader />
              <div className="font-sans text-[10px] uppercase leading-[1.2em]">
                Fetching validators list
              </div>
            </div>
          </div>
        )}
      </div>

      {status === 'error' && <p>Error: {(error as any).message}</p>}

      {status === 'success' && (
        <div>
          {valToRender.length ? (
            <div>
              {isMobile ? (
                <div className="border-haqq-border flex flex-col gap-[24px] border-t">
                  <ValidatorsListMobile
                    validators={valToRender}
                    delegationInfo={delegationInfo}
                    rewardsInfo={rewardsInfo}
                  />
                </div>
              ) : (
                <ValidatorsList
                  validators={valToRender}
                  delegationInfo={delegationInfo}
                  rewardsInfo={rewardsInfo}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-[20px]">
              <div className="mb-[4px] text-[14px] leading-[22px] text-white/50">
                You don't have any active delegations
              </div>
              <OrangeLink href="/staking">Go to Staking</OrangeLink>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
