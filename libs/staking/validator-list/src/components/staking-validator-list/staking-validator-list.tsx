import { Fragment, useCallback, useMemo, useState } from 'react';
import {
  useAddress,
  useStakingValidatorListQuery,
  useStakingRewardsQuery,
  useStakingDelegationQuery,
} from '@haqq/shared';
import { Checkbox, Container, Heading } from '@haqq/ui-kit';
import { ValidatorsList } from '@haqq/staking/ui-kit';
import { StakingInfo } from '@haqq/staking/validator-details';
import { sortValidatorsByToken, splitValidators } from '@haqq/staking/utils';

export function StakingValidatorList() {
  const [checked, setChecked] = useState<boolean>(false);
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

  const sortedAllValidators = useMemo(() => {
    const { active, inactive, jailed } = splitValidators(validatorsList);

    return [
      ...sortValidatorsByToken(active),
      ...sortValidatorsByToken(inactive),
      ...sortValidatorsByToken(jailed),
    ];
  }, [validatorsList]);

  const sortedDelegatedValidators = useMemo(() => {
    const filteredVals = sortedAllValidators.filter((validator) => {
      const rewardsInfo = getValidatorRewards(validator.operator_address);
      return rewardsInfo;
    });

    return filteredVals;
  }, [getValidatorRewards, sortedAllValidators]);

  return (
    <Fragment>
      <Container>
        <Heading level={2} className="mb-6">
          Staking
        </Heading>
        <StakingInfo />
      </Container>

      <Container className="flex flex-1 flex-col space-y-4">
        <div className="flex space-x-4 justify-between">
          <Heading level={3}>Validators</Heading>
          <Checkbox onChange={setChecked}>Show active delegations</Checkbox>
        </div>
        <ValidatorsList
          validators={checked ? sortedDelegatedValidators : sortedAllValidators}
          error={error}
          status={status}
          delegationInfo={delegationInfo}
          rewardsInfo={rewardsInfo}
        />
      </Container>
    </Fragment>
  );
}
