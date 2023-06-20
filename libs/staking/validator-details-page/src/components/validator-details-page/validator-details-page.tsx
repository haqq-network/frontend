import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ValidatorInfo } from '../validator-info/validator-info';
import { BackButton, Container } from '@haqq/shell-ui-kit';
import { Fragment } from 'react';
import { useConfig } from '@haqq/shared';

export function ValidatorDetailsPage() {
  const { address } = useParams();
  const navigate = useNavigate();
  const { isStandalone } = useConfig();

  if (!address) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <Fragment>
      <Container>
        <div className="py-[18px] sm:py-[26px] lg:py-[34px]">
          <BackButton
            onClick={() => {
              if (isStandalone) {
                navigate('/');
              } else {
                navigate('/staking');
              }
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
