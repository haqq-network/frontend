'use client';
import { Fragment } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@haqq/shell-shared';
import { Container } from '@haqq/shell-ui-kit';

const StakingInfo = dynamic(async () => {
  const { StakingInfo } = await import('./components/staking-info');
  return { default: StakingInfo };
});
const ValidatorList = dynamic(
  async () => {
    const { ValidatorList } = await import('./components/validator-list');
    return { default: ValidatorList };
  },
  { ssr: false },
);

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
