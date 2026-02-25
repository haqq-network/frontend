'use client';

import Link from 'next/link';
import { Button } from '@haqq/shell-ui-kit';
import { FundsSource } from '../constants/waitlist-config';
import type { Application } from '../hooks/use-waitlist-applications';
import type { WaitlistBalancesResponse } from '../hooks/use-waitlist-balances';
import { formatEthDecimal } from '@haqq/shell-shared';
import { formatWaitlistPrice } from '../utils/format-waitlist-price';
import { StatusBadge } from './status-badge';

export interface RequestsListProps {
  applications: Array<
    Application & {
      isPending?: boolean;
      txHash?: string;
    }
  >;
  canCancel: boolean;
  onCancel: (requestId: bigint) => void;
  onMintHaqq?: (applicationId: bigint) => void;
  isCancelling?: boolean;
  cancellingRequestId?: bigint;
  isMinting?: boolean;
  mintingApplicationId?: bigint;
  balances?: WaitlistBalancesResponse;
  locale?: string;
}

export function RequestsList({
  applications,
  canCancel,
  onCancel,
  onMintHaqq,
  isCancelling = false,
  cancellingRequestId,
  isMinting = false,
  mintingApplicationId,
  balances,
  locale = 'en',
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
      <div className="space-y-[12px]">
        {applications.map((app) => {
          const requestId =
            app.requestId === 'pending' ? 0n : BigInt(app.requestId);
          const amount = formatEthDecimal(BigInt(app.amount));
          const sourceLabel =
            app.source === FundsSource.OwnBalance ? 'Own Balance' : 'ucDAO';
          const isCancelled = app.cancelled;
          const isCancellingThis = cancellingRequestId === requestId;
          const isPending = app.isPending || false;

          return (
            <div
              key={app.requestId || app.txHash || `pending-${app.amount}`}
              className="rounded-[8px] border border-[#E5E7EB] bg-white p-[16px]"
            >
              <div className="flex flex-col gap-[12px] sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-[8px] flex items-center space-x-[8px]">
                    <span className="text-[14px] font-medium text-[#0D0D0E]">
                      {app.requestId === 'pending'
                        ? 'Request (Pending)'
                        : `Request #${app.requestId}`}
                    </span>
                    {isPending && (
                      <StatusBadge
                        label="Waiting"
                        tooltip="Your request is being processed on the blockchain. It will appear here once confirmed."
                        className="bg-[#FEF3C7] text-[#92400E]"
                      />
                    )}
                    {!isPending && isCancelled && (
                      <StatusBadge
                        label="Cancelled"
                        tooltip="This request was cancelled and will not be fulfilled."
                        className="bg-[#FEE2E2] text-[#DC2626]"
                      />
                    )}
                    {!isPending && !isCancelled && !app.valid && (
                      <StatusBadge
                        label="Invalid"
                        tooltip="This request is no longer valid (e.g. conditions have changed). It will not be fulfilled."
                        className="bg-[#FEF3C7] text-[#92400E]"
                      />
                    )}
                    {!isPending && !isCancelled && app.valid && app.ready && (
                      <StatusBadge
                        label="Ready"
                        tooltip="This request is valid and your balance is sufficient. You can mint HAQQ when the burn period opens."
                        className="bg-[#D1FAE5] text-[#065F46]"
                      />
                    )}
                    {!isPending && !isCancelled && app.valid && !app.ready && (
                      <StatusBadge
                        label="Not Ready"
                        tooltip="All your requests have been accepted and are valid, but your wallet balance is insufficient to fulfill them as some of your coins are currently staked. We recommend starting the undelegate process now."
                        className="bg-[#DBEAFE] text-[#1E40AF]"
                      />
                    )}
                  </div>
                  <div className="space-y-[4px] text-[14px] text-[#6B7280]">
                    <div>
                      Burn Amount:{' '}
                      <span className="font-medium text-[#0D0D0E]">
                        {amount} ISLM
                      </span>
                    </div>
                    {app.price !== undefined && app.price !== '' && (
                      <div>
                        Minting price:{' '}
                        <span className="font-[500] text-[#0D0D0E]">
                          {formatWaitlistPrice(app.price, { precision: 4 })}{' '}
                          ISLM/HAQQ
                        </span>
                      </div>
                    )}
                    {app.receiveAmount !== undefined &&
                      app.receiveAmount !== '' && (
                        <div>
                          Mint amount:{' '}
                          <span className="font-[500] text-[#0D0D0E]">
                            {formatEthDecimal(BigInt(app.receiveAmount), 4, 18)}{' '}
                            HAQQ
                          </span>
                        </div>
                      )}
                    <div>
                      Funds Source:{' '}
                      <span className="font-medium text-[#0D0D0E]">
                        {sourceLabel}
                      </span>
                    </div>
                    {/* Show undelegate link if not ready (happens when request uses staking funds) */}
                    {!isPending && !isCancelled && app.valid && !app.ready && (
                      <div className="mt-[8px]">
                        <Link
                          href={`/${locale}/staking`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-haqq-orange text-[14px] font-medium hover:underline"
                        >
                          Start undelegate
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-[8px] sm:flex-row">
                  {!isPending &&
                    !isCancelled &&
                    app.valid &&
                    app.ready &&
                    onMintHaqq && (
                      <Button
                        variant={5}
                        onClick={() => onMintHaqq(requestId)}
                        disabled={isMinting}
                        isLoading={
                          isMinting && mintingApplicationId === requestId
                        }
                        className="w-full sm:w-auto"
                      >
                        Mint HAQQ
                      </Button>
                    )}
                  {canCancel && !isCancelled && !isPending && (
                    <Button
                      variant={3}
                      onClick={() => onCancel(requestId)}
                      disabled={isCancelling}
                      isLoading={isCancellingThis}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
