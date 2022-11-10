import { Fragment } from 'react';
import { Container } from '@haqq/ui-kit';
import { ValidatorsList } from '../components/validators-list/validators-list';
import { StakingInfo } from '../components/rewards-info/rewards-info';

export function ValidatorsPage() {
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
