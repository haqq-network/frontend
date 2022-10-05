import { Fragment } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Container } from '@haqq/ui-kit';
import { ValidatorInfo } from '../components/validator-info/validator-info';
import { StakingInfo } from '../components/rewards-info/rewards-info';

export function ValidatorDetailsPage() {
  const { address } = useParams();

  if (!address) {
    return <Navigate to="/" replace />;
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
