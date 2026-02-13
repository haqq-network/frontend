'use client';

import { useMemo } from 'react';
import { formatEther } from 'viem';
import type { WaitlistBalancesResponse } from '../hooks/use-waitlist-balances';

export interface WaitlistBalancesProps {
  balances?: WaitlistBalancesResponse;
}

export function WaitlistBalances({ balances }: WaitlistBalancesProps) {
  const formattedBalances = useMemo(() => {
    if (!balances) {
      return null;
    }

    return {
      balance: {
        label: 'Balance',
        value: formatEther(BigInt(balances.balance)),
        valueBn: BigInt(balances.balance),
      },
      delegations: {
        label: 'Delegations',
        value: formatEther(BigInt(balances.delegations)),
        valueBn: BigInt(balances.delegations),
      },
      rewards: {
        label: 'Rewards',
        value: formatEther(BigInt(balances.rewards)),
        valueBn: BigInt(balances.rewards),
      },
      unbonding_delegations: {
        label: 'Unbonding',
        value: formatEther(BigInt(balances.unbonding_delegations)),
        valueBn: BigInt(balances.unbonding_delegations),
      },
      ucdao: {
        label: 'ucDAO',
        value: formatEther(BigInt(balances.ucdao)),
        valueBn: BigInt(balances.ucdao),
      },
      total_balance: {
        label: 'Total Balance',
        value: formatEther(BigInt(balances.total_balance)),
        valueBn: BigInt(balances.total_balance),
      },
      available_balance: {
        label: 'Available Balance',
        value: formatEther(BigInt(balances.available_balance)),
        valueBn: BigInt(balances.available_balance),
      },
      available_ucdao_balance: {
        label: 'Available ucDAO',
        value: formatEther(BigInt(balances.available_ucdao_balance)),
        valueBn: BigInt(balances.available_ucdao_balance),
      },
    };
  }, [balances]);

  const hasAnyBalance = useMemo(() => {
    if (!formattedBalances) {
      return false;
    }
    // Show balances even if they're negative (for transparency)
    return Object.values(formattedBalances).some(
      (balance) => balance.valueBn !== 0n,
    );
  }, [formattedBalances]);

  if (!formattedBalances || !hasAnyBalance) {
    return null;
  }

  return (
    <div className="mb-[24px] rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-[16px]">
      <div className="mb-[12px] text-[14px] font-semibold text-[#0D0D0E]">
        Your Balances
      </div>
      <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(formattedBalances).map(([key, balance]) => {
          if (balance.valueBn === 0n) {
            return null;
          }

          const isNegative = balance.valueBn < 0n;
          const displayValue = isNegative
            ? `-${parseFloat(balance.value.replace('-', '')).toLocaleString(
                'en-US',
                {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                },
              )}`
            : parseFloat(balance.value).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              });

          return (
            <div
              key={key}
              className="flex flex-col rounded-[6px] bg-white p-[12px]"
            >
              <div className="mb-[4px] text-[12px] font-medium text-[#6B7280]">
                {balance.label}
              </div>
              <div
                className={`text-[16px] font-semibold ${
                  isNegative ? 'text-[#DC2626]' : 'text-[#0D0D0E]'
                }`}
              >
                {displayValue} ISLM
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
