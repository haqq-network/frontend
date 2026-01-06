'use client';

import { RequestsState } from '../constants/waitlist-config';

export interface StatusMessagesProps {
  currentState?: RequestsState;
  canSubmit?: boolean;
  canWithdraw?: boolean;
  paused?: boolean;
  isCorrectChain: boolean;
  isConnected: boolean;
}

export function StatusMessages({
  currentState,
  canSubmit,
  canWithdraw,
  paused,
  isCorrectChain,
  isConnected,
}: StatusMessagesProps) {
  if (!isConnected) {
    return null;
  }

  if (!isCorrectChain) {
    return null;
  }

  if (paused) {
    return (
      <div className="mb-[24px] rounded-[8px] bg-[#FEE2E2] p-[16px]">
        <div className="text-[14px] font-[500] text-[#DC2626]">
          Waitlist is currently paused
        </div>
      </div>
    );
  }

  if (currentState === RequestsState.Initialed) {
    return (
      <div className="mb-[24px] rounded-[8px] bg-[#F3F4F6] p-[16px]">
        <div className="text-[14px] font-[500] text-[#6B7280]">
          Waitlist has not been opened yet
        </div>
      </div>
    );
  }

  if (currentState === RequestsState.Closed) {
    return (
      <div className="mb-[24px] rounded-[8px] bg-[#FEF3C7] p-[16px]">
        <div className="text-[14px] font-[500] text-[#92400E]">
          Waitlist is closed. You can still cancel your requests.
        </div>
      </div>
    );
  }

  if (currentState === RequestsState.Finalized) {
    return (
      <div className="mb-[24px] rounded-[8px] bg-[#DBEAFE] p-[16px]">
        <div className="text-[14px] font-[500] text-[#1E40AF]">
          Waitlist has been finalized
        </div>
      </div>
    );
  }

  if (currentState === RequestsState.Started && canSubmit) {
    return (
      <div className="mb-[24px] rounded-[8px] bg-[#D1FAE5] p-[16px]">
        <div className="text-[14px] font-[500] text-[#065F46]">
          Waitlist is open. You can participate now.
        </div>
      </div>
    );
  }

  return null;
}
