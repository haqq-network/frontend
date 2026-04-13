'use client';

import Link from 'next/link';
import { Button } from '@haqq/shell-ui-kit';
import { FundsSource } from '../constants/waitlist-config';
import type { Application } from '../hooks/use-waitlist-applications';
import type { WaitlistBalancesResponse } from '../hooks/use-waitlist-balances';
import { formatEthDecimal } from '@haqq/shell-shared';
import { formatWaitlistPrice } from '../utils/format-waitlist-price';
import { StatusBadge } from './status-badge';
import { SafeApproveWarning } from './safe-approve-warning';

export interface RequestsListProps {
  applications: Array<
    Application & {
      isPending?: boolean;
      txHash?: string;
      burned?: boolean;
    }
  >;
  canCancel: boolean;
  onCancel: (requestId: bigint) => void;
  onApprove?: (applicationId: bigint) => void;
  onMintHaqq?: (applicationId: bigint) => void;
  isCancelling?: boolean;
  cancellingRequestId?: bigint;
  isSafe?: boolean;
  isApproving?: boolean;
  isMinting?: boolean;
  mintingApplicationId?: bigint;
  balances?: WaitlistBalancesResponse;
  locale?: string;
}

export function RequestsList({
  applications,
  canCancel,
  onCancel,
  onApprove,
  onMintHaqq,
  isCancelling = false,
  cancellingRequestId,
  isSafe = false,
  isApproving = false,
  isMinting = false,
  mintingApplicationId,
  balances,
  locale = 'en',
}: RequestsListProps) {
  if (applications.length === 0) {
    return (
      <div className="rounded-[8px] bg-gray-100 p-[16px] text-center">
        <div className="text-[14px] text-gray-500">
          You haven't created any requests yet
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-[12px]">
      {isSafe && onApprove && <SafeApproveWarning />}
      <div className="space-y-[12px]">
        {applications.map((app) => {
          const requestId =
            app.requestId === 'pending' ? 0n : BigInt(app.requestId);
          const amount = formatEthDecimal(BigInt(app.amount));
          const sourceLabel =
            app.source === FundsSource.OwnBalance ? 'Own Balance' : 'ucDAO';
          const isCancelled = app.cancelled;
          const isBurned = app.burned || false;
          const isCancellingThis = cancellingRequestId === requestId;
          const isPending = app.isPending || false;

          return (
            <div
              key={app.requestId || app.txHash || `pending-${app.amount}`}
              className="rounded-[8px] border border-gray-200 bg-white p-[16px]"
            >
              <div className="flex flex-col gap-[12px] sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-[8px] flex items-center space-x-[8px]">
                    <span className="text-haqq-black text-[14px] font-medium">
                      {app.requestId === 'pending'
                        ? 'Request (Pending)'
                        : `Request #${app.requestId}`}
                    </span>
                    {isPending && (
                      <StatusBadge
                        label="Waiting"
                        tooltip="Your request is being processed on the blockchain. It will appear here once confirmed."
                        className="bg-amber-100 text-amber-800"
                      />
                    )}
                    {!isPending && isBurned && (
                      <StatusBadge
                        label="Executed"
                        tooltip="This request has been executed and the tokens have been burned."
                        className="bg-emerald-100 text-emerald-800"
                      />
                    )}
                    {!isPending && !isBurned && isCancelled && (
                      <StatusBadge
                        label="Cancelled"
                        tooltip="This request was cancelled and will not be fulfilled."
                        className="bg-red-100 text-red-600"
                      />
                    )}
                    {!isPending && !isBurned && !isCancelled && !app.valid && (
                      <StatusBadge
                        label="Invalid"
                        tooltip="This request is no longer valid (e.g. conditions have changed). It will not be fulfilled."
                        className="bg-amber-100 text-amber-800"
                      />
                    )}
                    {!isPending &&
                      !isBurned &&
                      !isCancelled &&
                      app.valid &&
                      app.ready && (
                        <StatusBadge
                          label="Ready"
                          tooltip="This request is valid and your balance is sufficient. You can mint HAQQ when the burn period opens."
                          className="bg-green-100 text-emerald-800"
                        />
                      )}
                    {!isPending &&
                      !isBurned &&
                      !isCancelled &&
                      app.valid &&
                      !app.ready && (
                        <StatusBadge
                          label="Not Ready"
                          tooltip="All your requests have been accepted and are valid, but your wallet balance is insufficient to fulfill them as some of your coins are currently staked. We recommend starting the undelegate process now."
                          className="bg-blue-100 text-blue-800"
                        />
                      )}
                  </div>
                  <div className="space-y-[4px] text-[14px] text-gray-500">
                    <div>
                      Burn Amount:{' '}
                      <span className="text-haqq-black font-medium">
                        {amount} ISLM
                      </span>
                    </div>
                    {app.price !== undefined && app.price !== '' && (
                      <div>
                        Minting price:{' '}
                        <span className="text-haqq-black font-medium">
                          {formatWaitlistPrice(app.price, { precision: 4 })}{' '}
                          ISLM/HAQQ
                        </span>
                      </div>
                    )}
                    {app.receiveAmount !== undefined &&
                      app.receiveAmount !== '' && (
                        <div>
                          Mint amount:{' '}
                          <span className="text-haqq-black font-medium">
                            {formatEthDecimal(BigInt(app.receiveAmount), 4, 18)}{' '}
                            HAQQ
                          </span>
                        </div>
                      )}
                    <div>
                      Funds Source:{' '}
                      <span className="text-haqq-black font-medium">
                        {sourceLabel}
                      </span>
                    </div>
                    {/* Show undelegate link if not ready (happens when request uses staking funds) */}
                    {!isPending &&
                      !isBurned &&
                      !isCancelled &&
                      app.valid &&
                      !app.ready && (
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
                    !isBurned &&
                    !isCancelled &&
                    app.valid &&
                    app.ready &&
                    onMintHaqq && (
                      <>
                        {isSafe && onApprove && (
                          <Button
                            variant={4}
                            onClick={() => onApprove(requestId)}
                            disabled={isApproving}
                            isLoading={isApproving}
                            className="w-full sm:w-auto"
                          >
                            {isApproving ? 'Approving...' : 'Approve'}
                          </Button>
                        )}
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
                      </>
                    )}
                  {canCancel && !isCancelled && !isBurned && !isPending && (
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
