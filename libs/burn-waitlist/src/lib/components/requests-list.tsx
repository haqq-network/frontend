'use client';

import { RequestItem } from './request-item';

export interface RequestsListProps {
  requestIds: bigint[];
  canCancel: boolean;
  onCancel: (requestId: bigint) => void;
  isCancelling?: boolean;
  cancellingRequestId?: bigint;
}

export function RequestsList({
  requestIds,
  canCancel,
  onCancel,
  isCancelling = false,
  cancellingRequestId,
}: RequestsListProps) {
  if (requestIds.length === 0) {
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
        {requestIds.map((id) => (
          <RequestItem
            key={id.toString()}
            requestId={id}
            canCancel={canCancel}
            onCancel={onCancel}
            isCancelling={isCancelling && cancellingRequestId === id}
          />
        ))}
      </div>
    </div>
  );
}
