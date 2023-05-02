import AnimatedNumber from 'react-animated-number';

interface StaticsBlockProps {
  stats: {
    mainnetAccountsCreated: number;
    transactionsInLast24Hours: number;
    secondsToConsensusFinality: number;
    averageCostPerTransaction: number;
    era: number;
    emissionRate: number;
    emittedAlready: number;
    willBeEmitted: number;
  };
  startAnimation?: boolean;
}

export function StatisticsBlockStatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="">
      <div className="font-serif text-[32px] leading-[42px] font-[500]">
        <AnimatedNumber
          component="text"
          value={value}
          style={{
            transition: '1s ease-out',
            fontSize: 32,
            transitionProperty: 'background-color, color, opacity',
          }}
          // frameStyle={(perc: number) =>
          //   perc === 100 ? {} : { backgroundColor: '#ffeb3b' }
          // }
          duration={2500}
          formatValue={(n: number) => n.toFixed(0)}
        />
      </div>
      <div className="font-sans text-[16px] leading-[26px]">{title}</div>
    </div>
  );
}

export function StatisticsBlock({ stats, startAnimation }: StaticsBlockProps) {
  console.log({ startAnimation });

  return (
    <div className="border-t border-haqq-border">
      <div
        className="px-[16px] mx-[16px] sm:pl-0 sm:ml-[63px] sm:mr-0 sm:pr-0 lg:ml-[79px] border-l border-haqq-border"
        id="stats"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] px-[32px] py-[60px]">
          <StatisticsBlockStatCard
            value={stats?.mainnetAccountsCreated}
            title="mainnet accounts created"
          />
          <StatisticsBlockStatCard
            value={stats?.transactionsInLast24Hours}
            title="transactions in the last 24 hours"
          />
          <StatisticsBlockStatCard
            value={stats?.secondsToConsensusFinality}
            title="seconds to consensus finality"
          />
          <StatisticsBlockStatCard
            value={stats?.averageCostPerTransaction}
            title="average cost per transaction"
          />
          <StatisticsBlockStatCard value={stats?.era} title="era" />
          <StatisticsBlockStatCard
            value={stats?.emissionRate}
            title="emission rate"
          />
          <StatisticsBlockStatCard
            value={stats?.emittedAlready}
            title="emitted already"
          />
          <StatisticsBlockStatCard
            value={stats?.willBeEmitted}
            title="will be emitted"
          />
        </div>
      </div>
    </div>
  );
}
