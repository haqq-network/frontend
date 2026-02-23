'use client';

import { useWaitlistRequest } from '../hooks/use-waitlist-contract';
import { FundsSource } from '../constants/waitlist-config';
import { Button } from '@haqq/shell-ui-kit';
import { formatEthDecimal } from '@haqq/shell-shared';

export interface RequestItemProps {
  requestId: bigint;
  canCancel: boolean;
  onCancel: (requestId: bigint) => void;
  isCancelling?: boolean;
}

export function RequestItem({
  requestId,
  canCancel,
  onCancel,
  isCancelling = false,
}: RequestItemProps) {
  const { request, isLoading } = useWaitlistRequest(requestId);

  if (isLoading) {
    return (
      <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-[16px]">
        <div className="text-[14px] text-[#6B7280]">Loading...</div>
      </div>
    );
  }

  if (!request) {
    return null;
  }

  const amount = formatEthDecimal(request.amount);
  const sourceLabel =
    request.source === FundsSource.OwnBalance ? 'Own Balance' : 'ucDAO';
  const isCancelled = request.cancelled;

  return (
    <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-[16px]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-[8px] flex items-center space-x-[8px]">
            <span className="text-[14px] font-medium text-[#0D0D0E]">
              Request #{requestId.toString()}
            </span>
            {isCancelled && (
              <span className="rounded-[4px] bg-[#FEE2E2] px-[8px] py-[2px] text-[12px] font-medium text-[#DC2626]">
                Cancelled
              </span>
            )}
          </div>
          <div className="space-y-[4px] text-[14px] text-[#6B7280]">
            <div>
              Amount:{' '}
              <span className="font-medium text-[#0D0D0E]">{amount} ISLM</span>
            </div>
            <div>
              Source:{' '}
              <span className="font-medium text-[#0D0D0E]">{sourceLabel}</span>
            </div>
          </div>
        </div>
        {canCancel && !isCancelled && (
          <Button
            variant={2}
            onClick={() => onCancel(requestId)}
            disabled={isCancelling}
            isLoading={isCancelling}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
