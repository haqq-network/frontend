import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ValidatorInfo } from '../validator-info/validator-info';
import { BackButton, Container } from '@haqq/shell/ui-kit';

export function StakingValidatorDetails() {
  const { address } = useParams();
  const navigate = useNavigate();

  if (!address) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <Container>
      <div className="sm:py-[26px py-[18px] lg:py-[34px]">
        <div className="mb-[18px] sm:mb-[26px] lg:mb-[34px]">
          <BackButton
            onClick={() => {
              navigate('/');
            }}
          >
            Staking
          </BackButton>
        </div>

        <ValidatorInfo validatorAddress={address} />
      </div>
    </Container>
  );
}
