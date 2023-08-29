import { useInViewport } from 'react-in-viewport';
import { useEffect, useRef, useState } from 'react';
import styles from './statistics-block.module.css';
import clsx from 'clsx';
import { MemoizedAnimatedNumbers } from '@haqq/haqq-website-ui-kit';

export interface ChainStats {
  mainnetAccountsCreated: number;
  transactionsInLast24Hours: number;
  secondsToConsensusFinality: number;
  averageCostPerTransaction: number;
  era: number;
  emissionRate: number;
  emittedAlready: number;
  willBeEmitted: number;
}

export function StatisticsBlockStatCard({
  title,
  value,
  startAnimation,
  prefix,
  postfix,
}: {
  title: string;
  value: number;
  startAnimation: boolean;
  prefix?: string;
  postfix?: string;
}) {
  return (
    <div>
      <div
        className={clsx(
          'font-serif text-[18px] font-[500] leading-[1.3em] sm:text-[24px] lg:text-[32px]',
          styles['statsBlock'],
        )}
      >
        {prefix && `${prefix} `}
        {startAnimation ? (
          <MemoizedAnimatedNumbers
            includeComma
            animateToNumber={value}
            locale="en-US"
            configs={(_, index) => {
              return {
                mass: 1,
                friction: 100,
                tension: 140 * (index + 1),
              };
            }}
          />
        ) : (
          <span>0</span>
        )}
        {postfix && ` ${postfix}`}
      </div>
      <div className="font-sans text-[13px] font-[500] leading-[1.6em] sm:text-[15px] lg:text-[16px]">
        {title}
      </div>
    </div>
  );
}

async function getMainnetAccounts(defaultValue: number) {
  try {
    const accountsResponse = await fetch(
      'https://rest.cosmos.haqq.network/cosmos/auth/v1beta1/accounts?pagination.count_total=true&pagination.limit=1',
    );
    const accounts = await accountsResponse.json();
    return Number.parseInt(accounts.pagination.total, 10);
  } catch (error) {
    console.error('Fetch mainnet accounts count failed', error);
    return defaultValue;
  }
}

export function StatisticsBlock() {
  const [startAnimation, setStartAnimation] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const { inViewport } = useInViewport(
    blockRef,
    {},
    { disconnectOnLeave: true },
  );
  const [stats, setStats] = useState<ChainStats | undefined>(undefined);

  useEffect(() => {
    async function getStats() {
      const mainnetAccountsCreated = await getMainnetAccounts(3476);

      setStats({
        mainnetAccountsCreated,
        transactionsInLast24Hours: 10000,
        secondsToConsensusFinality: 5.6,
        averageCostPerTransaction: 147,
        era: 1,
        emissionRate: 0,
        emittedAlready: 20000000000,
        willBeEmitted: 80000000000,
      });
    }

    getStats();
  }, []);

  useEffect(() => {
    if (inViewport && !startAnimation) {
      setStartAnimation(true);
    }
  }, [inViewport, startAnimation]);

  if (stats === undefined) {
    return null;
  }

  return (
    <div className="border-haqq-border border-t" ref={blockRef}>
      <div
        className="border-haqq-border mx-[16px] border-l px-[16px] sm:ml-[63px] sm:mr-0 sm:pl-0 sm:pr-0 lg:ml-[79px]"
        id="stats"
      >
        <div className="grid grid-cols-1 gap-[24px] py-[42px] sm:grid-cols-2 sm:px-[32px] sm:py-[60px] xl:grid-cols-4">
          <StatisticsBlockStatCard
            value={stats.mainnetAccountsCreated}
            title="mainnet accounts created"
            startAnimation={startAnimation}
          />
          <StatisticsBlockStatCard
            value={stats.transactionsInLast24Hours}
            title="transactions in the last 24 hours"
            startAnimation={startAnimation}
            prefix="~"
          />
          <StatisticsBlockStatCard
            value={stats.secondsToConsensusFinality}
            title="seconds to consensus finality"
            startAnimation={startAnimation}
            prefix="~"
          />
          <StatisticsBlockStatCard
            value={stats.averageCostPerTransaction}
            title="average cost per transaction"
            startAnimation={startAnimation}
            postfix="aISLM"
          />
          <StatisticsBlockStatCard
            value={stats.era}
            title="era"
            startAnimation={startAnimation}
          />
          <StatisticsBlockStatCard
            value={stats.emissionRate}
            title="emission rate"
            startAnimation={startAnimation}
          />
          <StatisticsBlockStatCard
            value={stats.emittedAlready}
            title="emitted already"
            startAnimation={startAnimation}
          />
          <StatisticsBlockStatCard
            value={stats.willBeEmitted}
            title="will be emitted"
            startAnimation={startAnimation}
          />
        </div>
      </div>
    </div>
  );
}
