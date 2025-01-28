import { Fragment } from 'react';
import { Container } from '@haqq/shell-ui-kit/server';
import { BackToStaking } from './components/back-to-staking';
import { ValidatorInfo } from './components/validator-info';

export function ValidatorDetailsPage({ address }: { address: string }) {
  return (
    <Fragment>
      <Container>
        <BackToStaking />
      </Container>

      <ValidatorInfo validatorAddress={address} />
    </Fragment>
  );
}
