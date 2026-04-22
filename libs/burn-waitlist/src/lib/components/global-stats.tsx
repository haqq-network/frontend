'use client';

import { type ReactNode } from 'react';
import { formatEthDecimal } from '@haqq/shell-shared';
import { Tooltip } from '@haqq/shell-ui-kit';
import type { EthiqTotalBurnedResponse } from '../hooks/use-ethiq-applications';

function StatRow({
  label,
  value,
  tooltip,
}: {
  label: string;
  value: ReactNode;
  tooltip?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-[4px]">
        <div className="text-[12px] text-[#6B7280]">{label}</div>
        {tooltip && (
          <Tooltip text={tooltip}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="cursor-pointer text-[#6B7280]"
            >
              <circle cx="7" cy="7" r="6.5" stroke="currentColor" />
              <text
                x="7"
                y="10.5"
                textAnchor="middle"
                fontSize="9"
                fill="currentColor"
                fontWeight="600"
              >
                ?
              </text>
            </svg>
          </Tooltip>
        )}
      </div>
      <div className="text-[18px] font-[600] text-[#0D0D0E]">{value}</div>
    </div>
  );
}

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
        <StatRow
          label="Total Applications"
          tooltip="Total number of applications submitted"
          value={
            isLoading
              ? '—'
              : globalStats?.totalCount !== undefined
                ? globalStats.totalCount.toString()
                : '—'
          }
        />
        <StatRow
          label="Total Amount"
          tooltip="Total amount of all submitted applications"
          value={
            isLoading
              ? '—'
              : globalStats?.totalAmount !== undefined
                ? `${formatEthDecimal(BigInt(globalStats.totalAmount), 4)} ISLM`
                : '—'
          }
        />
        {totalBurnedData && (
          <>
            <StatRow
              label="Total Burned"
              tooltip="Total amount of all burned ISLM"
              value={
                <>
                  {formatEthDecimal(
                    BigInt(totalBurnedData.total_burned.amount),
                    4,
                  )}{' '}
                  ISLM
                </>
              }
            />
            <StatRow
              label="Burned from Applications"
              tooltip="Amount of ISLM burned through applications"
              value={
                <>
                  {formatEthDecimal(
                    BigInt(
                      totalBurnedData.total_burned_from_applications.amount,
                    ),
                    4,
                  )}{' '}
                  ISLM
                </>
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
