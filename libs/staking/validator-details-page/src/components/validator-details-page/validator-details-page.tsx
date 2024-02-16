import { Fragment } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { BackButton, Container } from '@haqq/shell-ui-kit';
import { ValidatorInfo } from '../validator-info/validator-info';

export function ValidatorDetailsPage() {
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
              navigate('/staking');
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
