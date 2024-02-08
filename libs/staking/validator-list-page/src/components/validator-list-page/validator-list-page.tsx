import { Fragment } from 'react';
import { useWallet } from '@haqq/shared';
import { Container } from '@haqq/shell-ui-kit';
import { StakingInfo } from '../staking-info/staking-info';
import { ValidatorList } from '../validator-list/validator-list';

export function ValidatorListPage() {
  const { isHaqqWallet } = useWallet();

  return (
    <Fragment>
      {!isHaqqWallet && (
        <div className="py-[32px] lg:py-[68px]">
          <Container>
            <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
              Staking
            </div>
          </Container>
        </div>
      )}

      <StakingInfo />
      <ValidatorList />
    </Fragment>
  );
}
