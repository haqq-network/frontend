'use client';

import { formatEther } from 'viem';
import { Button } from '@haqq/shell-ui-kit';
import { FundsSource } from '../constants/waitlist-config';
import type { Application } from '../hooks/use-waitlist-applications';

export interface RequestsListProps {
  applications: Application[];
  canCancel: boolean;
  onCancel: (requestId: bigint) => void;
  isCancelling?: boolean;
  cancellingRequestId?: bigint;
}

export function RequestsList({
  applications,
  canCancel,
  onCancel,
  isCancelling = false,
  cancellingRequestId,
}: RequestsListProps) {
  if (applications.length === 0) {
    return (
      <div className="rounded-[8px] bg-[#F3F4F6] p-[16px] text-center">
        <div className="text-[14px] text-[#6B7280]">
          You haven't created any requests yet
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-[12px]">
      <h3 className="text-[16px] font-[600] text-[#0D0D0E]">Your Requests</h3>
      <div className="space-y-[12px]">
        {applications.map((app) => {
          const requestId = BigInt(app.requestId);
          const amount = formatEther(BigInt(app.amount));
          const sourceLabel =
            app.source === FundsSource.OwnBalance ? 'Own Balance' : 'ucDAO';
          const isCancelled = app.cancelled;
          const isCancellingThis = cancellingRequestId === requestId;

          return (
            <div
              key={app.requestId}
              className="rounded-[8px] border border-[#E5E7EB] bg-white p-[16px]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-[8px] flex items-center space-x-[8px]">
                    <span className="text-[14px] font-[500] text-[#0D0D0E]">
                      Request #{app.requestId}
                    </span>
                    {isCancelled && (
                      <span className="rounded-[4px] bg-[#FEE2E2] px-[8px] py-[2px] text-[12px] font-[500] text-[#DC2626]">
                        Cancelled
                      </span>
                    )}
                    {!isCancelled && !app.valid && (
                      <span className="rounded-[4px] bg-[#FEF3C7] px-[8px] py-[2px] text-[12px] font-[500] text-[#92400E]">
                        Invalid
                      </span>
                    )}
                    {!isCancelled && app.valid && app.ready && (
                      <span className="rounded-[4px] bg-[#D1FAE5] px-[8px] py-[2px] text-[12px] font-[500] text-[#065F46]">
                        Ready
                      </span>
                    )}
                    {!isCancelled && app.valid && !app.ready && (
                      <span className="rounded-[4px] bg-[#DBEAFE] px-[8px] py-[2px] text-[12px] font-[500] text-[#1E40AF]">
                        Not Ready
                      </span>
                    )}
                  </div>
                  <div className="space-y-[4px] text-[14px] text-[#6B7280]">
                    <div>
                      Amount:{' '}
                      <span className="font-[500] text-[#0D0D0E]">
                        {amount} ISLM
                      </span>
                    </div>
                    <div>
                      Source:{' '}
                      <span className="font-[500] text-[#0D0D0E]">
                        {sourceLabel}
                      </span>
                    </div>
                  </div>
                </div>
                {canCancel && !isCancelled && (
                  <Button
                    variant={2}
                    onClick={() => onCancel(requestId)}
                    disabled={isCancelling}
                    isLoading={isCancellingThis}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
