import { Fragment, useCallback, useMemo, useState } from 'react';
import { useQuery } from 'wagmi';
import { useCosmosService } from '@haqq/providers';
import { useAddress } from '@haqq/hooks';
import { Checkbox, Container, Heading } from '@haqq/ui-kit';
import { ValidatorsList } from '@haqq/staking/ui-kit';
import { StakingInfo } from '@haqq/staking/validator-details';
import { sortValidatorsByToken, splitValidators } from '@haqq/staking/utils';

export function StakingValidatorList() {
  const [checked, setChecked] = useState<boolean>(false);

  const { haqqAddress } = useAddress();

  const handleChange = (value: boolean) => {
    setChecked(value);
  };

  const { getAllValidators, getRewardsInfo, getAccountDelegations } =
    useCosmosService();

  const {
    data: validatorsList,
    error,
    status,
  } = useQuery(['validators'], () => {
    return getAllValidators(1000);
  });

  const { data: rewardsInfo } = useQuery(['rewards', haqqAddress], () => {
    if (!haqqAddress) {
      return null;
    }

    return getRewardsInfo(haqqAddress);
  });

  const { data: delegationInfo } = useQuery(['delegation', haqqAddress], () => {
    if (!haqqAddress) {
      return null;
    }

    return getAccountDelegations(haqqAddress);
  });

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
    const sortedVals = [
      ...sortValidatorsByToken(active),
      ...sortValidatorsByToken(inactive),
      ...sortValidatorsByToken(jailed),
    ];

    return sortedVals;
  }, [validatorsList]);

  const sortedDelegatedValidators = useMemo(() => {
    const { active, inactive, jailed } = splitValidators(validatorsList);
    const sortedVals = [
      ...sortValidatorsByToken(active),
      ...sortValidatorsByToken(inactive),
      ...sortValidatorsByToken(jailed),
    ];
    const filteredVals = sortedVals.filter((validator) => {
      const rewardsInfo = getValidatorRewards(validator.operator_address);
      return rewardsInfo;
    });

    return filteredVals;
  }, [getValidatorRewards, validatorsList]);

  return (
    <Fragment>
      <Container>
        <Heading level={2} className="mb-4">
          Staking
        </Heading>
        <StakingInfo />
      </Container>

      <Container className="flex flex-1 flex-col space-y-4">
        <div className="flex space-x-4 justify-between">
          <Heading level={3}>Validators</Heading>
          <Checkbox className="" onChange={handleChange}>
            Show active delegations
          </Checkbox>
        </div>
        <ValidatorsList
          validators={
            checked ? sortedDelegatedValidators : sortedAllValidators
          }
          error={error}
          status={status}
          delegationInfo={delegationInfo}
          rewardsInfo={rewardsInfo}
        />
      </Container>
    </Fragment>
  );
}
