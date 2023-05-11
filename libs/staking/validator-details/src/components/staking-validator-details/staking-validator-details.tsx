import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ValidatorInfo } from '../validator-info/validator-info';
import { BackButton } from '@haqq/shell/ui-kit-next';

export function StakingValidatorDetails() {
  const { address } = useParams();
  const navigate = useNavigate();

  if (!address) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <div className="mx-auto flex w-full flex-1 flex-col px-[16px] sm:px-[48px] lg:px-[79px] lg:py-[34px]">
      <div className="mb-[34px]">
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
  );
}
