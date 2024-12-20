import { useMemo } from 'react';
import { useChainStatsQuery } from '@haqq/shell-shared';
import { formatNumber, formatPercents } from '@haqq/shell-ui-kit/server';

export function StatisticsBlock() {
  const { data: chainStats, isFetching, isFetched } = useChainStatsQuery();

  const {
    valsTotal,
    valsActive,
    totalStaked,
    totalSupply,
    totalAccounts,
    stakeRatio,
  } = useMemo(() => {
    if (isFetched && chainStats) {
      return {
        valsTotal: parseInt(chainStats.validatorsCount),
        valsActive: parseInt(chainStats.validatorsActive),
        totalStaked: parseFloat(chainStats.staked),
        totalSupply: parseFloat(chainStats.supply),
        totalAccounts: parseInt(chainStats.accounts),
        stakeRatio: chainStats.stakeRatio,
      };
    }

    return {
      valsTotal: 0,
      valsActive: 0,
      totalStaked: 0,
      totalSupply: 0,
      totalAccounts: 0,
      stakeRatio: '0',
    };
  }, [chainStats, isFetched]);

  return (
    <div className="flex flex-col gap-y-[10px] lg:flex-row lg:flex-wrap lg:gap-x-[24px]">
      <div className="flex h-[20px] flex-row items-center space-x-[9px]">
        <div className="font-clash mb-[-3px] text-[12px] uppercase leading-[20px] tracking-[.01em] text-white/50 sm:text-[14px]">
          Total supply
        </div>
        <div className="font-guise inline-flex space-x-[5px] text-[12px] font-[500] leading-[20px] sm:text-[13px]">
          {!isFetching && (
            <div>
              {formatNumber(totalSupply)}
              <span className="text-white/50">&nbsp;ISLM</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex h-[20px] flex-row items-center space-x-[9px]">
        <div className="font-clash mb-[-3px] text-[12px] uppercase leading-[20px] tracking-[.01em] text-white/50 sm:text-[14px]">
          Total staked ({formatPercents(stakeRatio)}%)
        </div>
        <div className="font-guise inline-flex space-x-[5px] text-[12px] font-[500] leading-[20px] sm:text-[13px]">
          {!isFetching && (
            <div>
              {formatNumber(totalStaked)}
              <span className="text-white/50">&nbsp;ISLM</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex h-[20px] flex-row items-center space-x-[9px]">
        <div className="font-clash mb-[-3px] text-[12px] uppercase leading-[20px] tracking-[.01em] text-white/50 sm:text-[14px]">
          Accounts
        </div>
        <div className="font-guise inline-flex space-x-[5px] text-[12px] font-[500] leading-[20px] sm:text-[13px]">
          {!isFetching && <div>{totalAccounts}</div>}
        </div>
      </div>
      <div className="flex h-[20px] flex-row items-center space-x-[9px]">
        <div className="font-clash mb-[-3px] text-[12px] uppercase leading-[20px] tracking-[.01em] text-white/50 sm:text-[14px]">
          Active validators
        </div>
        <div className="font-guise inline-flex space-x-[5px] text-[12px] font-[500] leading-[20px] sm:text-[13px]">
          {!isFetching && (
            <div>
              {valsActive}
              <span className="text-white/50">&nbsp;out of {valsTotal}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
