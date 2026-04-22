'use client';

import { formatEthDecimal } from '@haqq/shell-shared';

export interface UserAggregatesProps {
  totalCount: number;
  totalAmount: bigint;
}

export function UserAggregates({
  totalCount,
  totalAmount,
}: UserAggregatesProps) {
  return (
    <div className="mb-[24px] rounded-[8px] bg-gray-100 p-[16px]">
      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
        <div>
          <div className="text-[12px] text-gray-500">Your Applications</div>
          <div className="text-haqq-black text-[18px] font-semibold">
            {totalCount}
          </div>
        </div>
        <div>
          <div className="text-[12px] text-gray-500">Your Total Amount</div>
          <div className="text-haqq-black text-[18px] font-semibold">
            {formatEthDecimal(totalAmount, 4)} ISLM
          </div>
        </div>
      </div>
    </div>
  );
}
