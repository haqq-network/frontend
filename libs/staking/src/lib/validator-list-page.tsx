'use client';
import { Fragment } from 'react';
import { useWallet } from '@haqq/shell-shared';
import { Container } from '@haqq/shell-ui-kit/server';
import { StakingInfo } from './components/staking-info';
import { StrideStats } from './components/stride/statistics/stride-stats';
import { ValidatorList } from './components/validator-list';

export function ValidatorListPage({
  isMobileUserAgent,
  seedPhrase,
}: {
  isMobileUserAgent: boolean;
  seedPhrase: string;
}) {
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

      <ValidatorList
        isMobileUserAgent={isMobileUserAgent}
        seedPhrase={seedPhrase}
      />
    </Fragment>
  );
}
