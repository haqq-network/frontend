import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ValidatorInfo } from '../validator-info/validator-info';
import { BackButton, Container } from '@haqq/shell/ui-kit';
import { Fragment } from 'react';

export function StakingValidatorDetails() {
  const { address } = useParams();
  const navigate = useNavigate();

  if (!address) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <Fragment>
      <Container>
        <div className="py-[18px] sm:py-[26px] lg:py-[34px]">
          <BackButton
            onClick={() => {
              navigate('/');
            }}
          >
            Staking
          </BackButton>
        </div>
      </Container>

      <ValidatorInfo validatorAddress={address} />
    </Fragment>
  );
}
