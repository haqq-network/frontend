'use client';
import { useInViewport } from 'react-in-viewport';
import { useEffect, useMemo, useRef, useState } from 'react';
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

export function StatisticsBlock({ stats }: { stats: ChainStats }) {
  const [startAnimation, setStartAnimation] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const { inViewport } = useInViewport(
    blockRef,
    {},
    { disconnectOnLeave: true },
  );

  const {
    averageCostPerTransaction,
    emissionRate,
    emittedAlready,
    era,
    mainnetAccountsCreated,
    secondsToConsensusFinality,
    transactionsInLast24Hours,
    willBeEmitted,
  } = stats;

  useEffect(() => {
    if (inViewport && !startAnimation) {
      setStartAnimation(true);
    }
  }, [inViewport, startAnimation]);

  const memoizedStats = useMemo(() => {
    return {
      mainnetAccountsCreated,
      transactionsInLast24Hours,
      secondsToConsensusFinality,
      averageCostPerTransaction,
      era,
      emissionRate,
      emittedAlready,
      willBeEmitted,
    };
  }, [
    averageCostPerTransaction,
    emissionRate,
    emittedAlready,
    era,
    mainnetAccountsCreated,
    secondsToConsensusFinality,
    transactionsInLast24Hours,
    willBeEmitted,
  ]);

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
            value={memoizedStats.mainnetAccountsCreated}
            title="mainnet accounts created"
            startAnimation={startAnimation}
          />
          <StatisticsBlockStatCard
            value={memoizedStats.transactionsInLast24Hours}
            title="transactions in the last 24 hours"
            startAnimation={startAnimation}
            prefix="~"
          />
          <StatisticsBlockStatCard
            value={memoizedStats.secondsToConsensusFinality}
            title="seconds to consensus finality"
            startAnimation={startAnimation}
            prefix="~"
          />
          <StatisticsBlockStatCard
            value={memoizedStats.averageCostPerTransaction}
            title="average cost per transaction"
            startAnimation={startAnimation}
            postfix="aISLM"
          />
          <StatisticsBlockStatCard
            value={memoizedStats.era}
            title="era"
            startAnimation={startAnimation}
          />
          <StatisticsBlockStatCard
            value={memoizedStats.emissionRate}
            title="emission rate"
            startAnimation={startAnimation}
          />
          <StatisticsBlockStatCard
            value={memoizedStats.emittedAlready}
            title="emitted already"
            startAnimation={startAnimation}
          />
          <StatisticsBlockStatCard
            value={memoizedStats.willBeEmitted}
            title="will be emitted"
            startAnimation={startAnimation}
          />
        </div>
      </div>
    </div>
  );
}
