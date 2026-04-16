'use client';

import { RequestsList } from './requests-list';
import { RequestsListSkeleton } from './requests-list-skeleton';
import type { MergedApplication } from '../hooks/use-waitlist-page';
import type { WaitlistBalancesResponse } from '../hooks/use-waitlist-balances';

export interface RequestsSectionProps {
  applications: MergedApplication[];
  isLoading: boolean;
  hasData: boolean;
  canCancel: boolean;
  onCancel: (requestId: bigint) => void;
  onApprove?: (applicationId: bigint) => void;
  onMintHaqq?: (applicationId: bigint) => void;
  isCancelling: boolean;
  cancellingRequestId?: bigint;
  isSafe?: boolean;
  isApproving?: boolean;
  authzNeedsApproval?: boolean;
  isMinting: boolean;
  mintingApplicationId?: bigint;
  balances?: WaitlistBalancesResponse;
  locale?: string;
}

export function RequestsSection({
  applications,
  isLoading,
  hasData,
  canCancel,
  onCancel,
  onApprove,
  onMintHaqq,
  isCancelling,
  cancellingRequestId,
  isSafe,
  isApproving,
  authzNeedsApproval,
  isMinting,
  mintingApplicationId,
  balances,
  locale = 'en',
}: RequestsSectionProps) {
  return (
    <div>
      <h2 className="text-haqq-black mb-[16px] text-[18px] font-semibold">
        Your Requests
      </h2>
      {isLoading ? (
        <RequestsListSkeleton />
      ) : hasData ? (
        <RequestsList
          applications={applications}
          canCancel={canCancel}
          onCancel={onCancel}
          onApprove={onApprove}
          onMintHaqq={onMintHaqq}
          isCancelling={isCancelling}
          cancellingRequestId={cancellingRequestId}
          isSafe={isSafe}
          isApproving={isApproving}
          authzNeedsApproval={authzNeedsApproval}
          isMinting={isMinting}
          mintingApplicationId={mintingApplicationId}
          balances={balances}
          locale={locale}
        />
      ) : (
        <div className="rounded-[8px] bg-gray-100 p-[16px] text-center">
          <div className="text-[14px] text-gray-500">
            You haven't created any requests yet
          </div>
        </div>
      )}
    </div>
  );
}
