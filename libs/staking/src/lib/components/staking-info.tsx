'use client';
import { useMemo } from 'react';
import clsx from 'clsx';
import { useMediaQuery } from 'usehooks-ts';
import { useAccount, useChains } from 'wagmi';
import { haqqTestedge2 } from 'wagmi/chains';
import { useAddress, useWallet } from '@haqq/shell-shared';
import { Button } from '@haqq/shell-ui-kit';
import { Container, formatNumber } from '@haqq/shell-ui-kit/server';
import { StakingStatsDesktop, StakingStatsMobile } from './staking-stats';
import { useStakingStats } from '../hooks/use-staking-stats';

export function StakingInfo() {
  const { ethAddress, haqqAddress } = useAddress();
  const { openSelectWallet, isHaqqWallet } = useWallet();
  const isWalletConnected = Boolean(ethAddress && haqqAddress);
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const {
    staked,
    rewards,
    unbounded,
    balance,
    handleRewardsClaim,
    isRewardsPending,
  } = useStakingStats();
  const isTablet = useMediaQuery('(max-width: 1023px)');

  const isTestedge = useMemo(() => {
    return chain.id === haqqTestedge2.id;
  }, [chain.id]);

  if (!isWalletConnected) {
    return (
      <section
        className={clsx(
          'border-haqq-border sticky z-[49] w-full transform-gpu border-y-[1px] py-[32px] backdrop-blur',
          isTestedge
            ? 'top-[102px] sm:top-[111px]'
            : 'top-[62px] sm:top-[70px]',
        )}
      >
        <Container className="flex min-h-[100px] flex-col items-center justify-center gap-[12px]">
          <div className="font-guise text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
            You should connect wallet first
          </div>
          <div>
            <Button
              onClick={openSelectWallet}
              variant={2}
              className="text-black hover:bg-transparent hover:text-white"
            >
              Connect wallet
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      className={clsx(
        'border-haqq-border bg-haqq-black/15 z-[49] w-full transform-gpu border-y-[1px] backdrop-blur',
        isHaqqWallet
          ? isTestedge
            ? 'top-[101px] sm:top-[111px]'
            : 'top-[62px] sm:top-[72px]'
          : isTestedge
            ? 'top-[99px] sm:top-[110px]'
            : 'top-[62px] sm:top-[70px]',
        isHaqqWallet && '!border-t-[0px]',
        !isTablet && 'sticky py-[32px]',
      )}
    >
      {isTablet ? (
        <StakingStatsMobile
          balance={formatNumber(balance)}
          delegated={formatNumber(staked)}
          rewards={formatNumber(rewards)}
          unbounded={formatNumber(unbounded)}
          symbol="ISLM"
          onRewardsClaim={handleRewardsClaim}
          isRewardsPending={isRewardsPending}
        />
      ) : (
        <StakingStatsDesktop
          balance={formatNumber(balance)}
          delegated={formatNumber(staked)}
          rewards={formatNumber(rewards)}
          unbounded={formatNumber(unbounded)}
          symbol="ISLM"
          onRewardsClaim={handleRewardsClaim}
          isRewardsPending={isRewardsPending}
        />
      )}
    </section>
  );
}
