import { Fragment } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Container } from '@haqq/ui-kit';
import { ValidatorInfo } from '../validator-info/validator-info';
import { StakingInfo } from '@haqq/staking/ui-kit';

export function StakingValidatorDetails() {
  const { address } = useParams();

  if (!address) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <Container className="flex flex-1">
      <ValidatorInfo validatorAddress={address} />
    </Container>
  );
}
