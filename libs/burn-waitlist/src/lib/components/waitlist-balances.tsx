'use client';

import { useMemo } from 'react';
import { formatEther } from 'viem';
import { useAddress, useIndexerBalanceQuery } from '@haqq/shell-shared';

export interface WaitlistBalancesProps {
  walletBalance?: bigint;
}

export function WaitlistBalances({ walletBalance }: WaitlistBalancesProps) {
  const { haqqAddress } = useAddress();
  const { data: indexerBalances } = useIndexerBalanceQuery(haqqAddress);

  const balances = useMemo(() => {
    const walletBalanceFormatted = walletBalance
      ? formatEther(walletBalance)
      : '0';

    return {
      wallet: {
        label: 'Wallet Balance',
        value: walletBalanceFormatted,
        valueBn: walletBalance || 0n,
      },
      locked: {
        label: 'Locked',
        value: indexerBalances?.locked.toFixed(6) || '0',
        valueBn: indexerBalances?.lockedBn || 0n,
      },
      vested: {
        label: 'Vested',
        value: indexerBalances?.vested.toFixed(6) || '0',
        valueBn: indexerBalances?.vestedBn || 0n,
      },
      daoLocked: {
        label: 'DAO Locked',
        value: indexerBalances?.daoLocked.toFixed(6) || '0',
        valueBn: indexerBalances?.daoLockedBn || 0n,
      },
      available: {
        label: 'Available',
        value: indexerBalances?.available.toFixed(6) || '0',
        valueBn: indexerBalances?.availableBn || 0n,
      },
    };
  }, [walletBalance, indexerBalances]);

  const hasAnyBalance = useMemo(() => {
    return (
      balances.wallet.valueBn > 0n ||
      balances.locked.valueBn > 0n ||
      balances.vested.valueBn > 0n ||
      balances.daoLocked.valueBn > 0n ||
      balances.available.valueBn > 0n
    );
  }, [balances]);

  if (!hasAnyBalance) {
    return null;
  }

  return (
    <div className="mb-[24px] rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-[16px]">
      <div className="mb-[12px] text-[14px] font-[600] text-[#0D0D0E]">
        Your Balances
      </div>
      <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(balances).map(([key, balance]) => {
          if (balance.valueBn === 0n) {
            return null;
          }

          return (
            <div
              key={key}
              className="flex flex-col rounded-[6px] bg-white p-[12px]"
            >
              <div className="mb-[4px] text-[12px] font-[500] text-[#6B7280]">
                {balance.label}
              </div>
              <div className="text-[16px] font-[600] text-[#0D0D0E]">
                {parseFloat(balance.value).toLocaleString('en-US', {
                  maximumFractionDigits: 6,
                })}{' '}
                ISLM
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
