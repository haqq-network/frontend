import { useMemo } from 'react';
import { T, useTranslate } from '@tolgee/react';
import { useChainStatsQuery } from '@haqq/shell-shared';
import { formatNumber, formatPercents } from '@haqq/shell-ui-kit/server';

export function StatisticsBlock() {
  const { t } = useTranslate('main');
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
      <div className="flex flex-row items-center space-x-[9px]">
        <div className="font-clash mb-[-3px] text-[12px] uppercase leading-[20px] tracking-[.01em] text-white/50 sm:text-[14px]">
          {t('total-supply', 'Total supply')}
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
      <div className="flex flex-row items-center space-x-[9px]">
        <div className="font-clash mb-[-3px] text-[12px] uppercase leading-[20px] tracking-[.01em] text-white/50 sm:text-[14px]">
          {t('total-staked', 'Total staked')} ({formatPercents(stakeRatio)}%)
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
      <div className="flex flex-row items-center space-x-[9px]">
        <div className="font-clash mb-[-3px] text-[12px] uppercase leading-[20px] tracking-[.01em] text-white/50 sm:text-[14px]">
          {t('accounts', 'Accounts')}
        </div>
        <div className="font-guise inline-flex space-x-[5px] text-[12px] font-[500] leading-[20px] sm:text-[13px]">
          {!isFetching && <div>{totalAccounts}</div>}
        </div>
      </div>
      <div className="flex flex-row items-center space-x-[9px]">
        <div className="font-clash mb-[-3px] text-[12px] uppercase leading-[20px] tracking-[.01em] text-white/50 sm:text-[14px]">
          {t('active-validators', 'Active validators')}
        </div>
        <div className="font-guise inline-flex space-x-[5px] text-[12px] font-[500] leading-[20px] sm:text-[13px]">
          {!isFetching && (
            <div>
              <T
                keyName="active-out-of-total"
                ns="main"
                defaultValue="{active} <span>out of {total}</span>"
                params={{
                  active: valsActive,
                  total: valsTotal,
                  span: <span className="text-white/50" />,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
