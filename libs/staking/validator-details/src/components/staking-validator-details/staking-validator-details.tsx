import { Fragment } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Container } from '@haqq/ui-kit';
import { ValidatorInfo } from '../validator-info/validator-info';
import { StakingInfo } from '../rewards-info/rewards-info';

export function StakingValidatorDetails() {
  const { address } = useParams();

  if (!address) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <Fragment>
      <Container>
        <StakingInfo />
      </Container>

      <Container className="flex flex-1">
        <ValidatorInfo validatorAddress={address} />
      </Container>
    </Fragment>
  );
}
