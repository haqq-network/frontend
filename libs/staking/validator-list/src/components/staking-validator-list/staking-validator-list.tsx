import { Fragment } from 'react';
import { Container, Heading } from '@haqq/ui-kit';
import { ValidatorsList } from '../validators-list/validators-list';
import { StakingInfo } from '@haqq/staking/validator-details';

export function StakingValidatorList() {
  return (
    <Fragment>
      <Container>
        <Heading level={2} className="mb-4">
          Staking
        </Heading>
        <StakingInfo />
      </Container>

      <Container className="flex flex-1 flex-col">
        <Heading level={3} className="mb-4">
          All validators
        </Heading>

        <ValidatorsList />
      </Container>
    </Fragment>
  );
}
