'use client';

import { formatEthDecimal } from '@haqq/shell-shared';
import type { EthiqTotalBurnedResponse } from '../hooks/use-ethiq-applications';

export interface GlobalStatsProps {
  globalStats?: {
    totalCount?: number;
    totalAmount?: string;
  };
  isLoading: boolean;
  totalBurnedData?: EthiqTotalBurnedResponse;
}

export function GlobalStats({
  globalStats,
  isLoading,
  totalBurnedData,
}: GlobalStatsProps) {
  return (
    <div className="mb-[24px] rounded-[8px] bg-[#F3F4F6] p-[16px]">
      <div className="grid grid-cols-2 gap-[16px]">
        <div>
          <div className="text-[12px] text-[#6B7280]">Total Applications</div>
          <div className="text-[18px] font-[600] text-[#0D0D0E]">
            {isLoading
              ? '—'
              : globalStats?.totalCount !== undefined
                ? globalStats.totalCount.toString()
                : '—'}
          </div>
        </div>
        <div>
          <div className="text-[12px] text-[#6B7280]">Total Amount</div>
          <div className="text-[18px] font-[600] text-[#0D0D0E]">
            {isLoading
              ? '—'
              : globalStats?.totalAmount !== undefined
                ? `${formatEthDecimal(BigInt(globalStats.totalAmount), 4)} ISLM`
                : '—'}
          </div>
          {totalBurnedData && (
            <>
              <div>
                <div className="text-[12px] text-gray-500">Total Burned</div>
                <div className="text-haqq-black text-[18px] font-semibold">
                  {formatEthDecimal(
                    BigInt(totalBurnedData.total_burned.amount),
                    4,
                  )}{' '}
                  ISLM
                </div>
              </div>
              <div>
                <div className="text-[12px] text-gray-500">
                  Burned from Applications
                </div>
                <div className="text-haqq-black text-[18px] font-semibold">
                  {formatEthDecimal(
                    BigInt(
                      totalBurnedData.total_burned_from_applications.amount,
                    ),
                    4,
                  )}{' '}
                  ISLM
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
