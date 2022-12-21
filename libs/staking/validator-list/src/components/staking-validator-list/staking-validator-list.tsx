import { Fragment } from 'react';
import { Container } from '@haqq/ui-kit';
import { ValidatorsList } from '../validators-list/validators-list';
import { StakingInfo } from '@haqq/staking/validator-details';

export function StakingValidatorList() {
  return (
    <Fragment>
      <Container>
        <StakingInfo />
      </Container>

      <Container className="flex flex-1">
        <ValidatorsList />
      </Container>
    </Fragment>
  );
}
