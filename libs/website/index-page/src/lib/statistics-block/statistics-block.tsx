import dynamic from 'next/dynamic';
import { useInViewport } from 'react-in-viewport';
import { useEffect, useRef, useState } from 'react';
import styles from './statistics-block.module.css';
import clsx from 'clsx';

const AnimatedNumbers = dynamic(
  () => {
    return import('react-animated-numbers');
  },
  { ssr: false },
);

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

interface StaticsBlockProps {
  stats: ChainStats;
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
          'font-serif text-[32px] leading-[42px] font-[500] h-[42px]',
          styles.statsBlock,
        )}
      >
        {prefix && `${prefix} `}
        {startAnimation ? (
          <AnimatedNumbers
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
      <div className="font-sans text-[16px] leading-[26px]">{title}</div>
    </div>
  );
}

export function StatisticsBlock({ stats }: StaticsBlockProps) {
  const [startAnimation, setStartAnimation] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const { inViewport } = useInViewport(
    blockRef,
    {},
    { disconnectOnLeave: true },
  );
  useEffect(() => {
    if (inViewport && !startAnimation) {
      setStartAnimation(true);
      // setTimeout(() => {
      // }, 150);
    }
  }, [inViewport, startAnimation]);

  return (
    <div className="border-t border-haqq-border" ref={blockRef}>
      <div
        className="px-[16px] mx-[16px] sm:pl-0 sm:ml-[63px] sm:mr-0 sm:pr-0 lg:ml-[79px] border-l border-haqq-border"
        id="stats"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] px-[32px] py-[60px]">
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
