'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { formatEther } from 'viem';
import { Container } from '@haqq/shell-ui-kit/server';
import {
  useWaitlistContractState,
  useCreateWaitlistRequest,
  useCancelWaitlistRequest,
  useWaitlistBalances,
  useWaitlistApplications,
} from './hooks';
import type { Application } from './hooks/use-waitlist-applications';
import { useBackendSignature } from './hooks/use-backend-signature';
import { useWaitlistForm } from './hooks/use-waitlist-form';
import {
  ParticipationForm,
  ParticipationFormSkeleton,
  RequestsList,
  RequestsListSkeleton,
  StatusMessages,
  WalletConnectionWarning,
  NetworkWarning,
} from './components';
import {
  FundsSource,
  WAITLIST_DEFAULT_CHAIN_ID,
} from './constants/waitlist-config';

export interface WaitlistPageProps {
  locale?: string;
}

export function WaitlistPage({ locale = 'en' }: WaitlistPageProps = {}) {
  const { address, isConnected, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  // Contract state
  const {
    currentState,
    canSubmit,
    canWithdraw,
    paused,
    isCorrectChain,
    totalAmount,
    totalCount,
    refetchAll: refetchContractState,
  } = useWaitlistContractState();

  // Get balances from backend API
  const {
    data: waitlistBalances,
    isLoading: isLoadingBalances,
    refetch: refetchBalances,
  } = useWaitlistBalances(address);

  // Get applications from backend API
  const {
    data: applicationsData,
    isLoading: isLoadingApplications,
    refetch: refetchApplications,
  } = useWaitlistApplications({
    address: address,
    status: 'active',
  });

  // User wallet balance (EVM) - for display purposes
  const { data: walletBalance, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}` | undefined,
    chainId: chain?.id || WAITLIST_DEFAULT_CHAIN_ID,
  });

  // Create request
  const {
    createRequest: createRequestTx,
    isPending: isCreating,
    isConfirming: isConfirmingCreate,
    isSuccess: isCreateSuccess,
    hash: createHash,
    error: createError,
  } = useCreateWaitlistRequest();

  // Cancel request
  const {
    cancelRequest: cancelRequestTx,
    isPending: isCancelling,
    isConfirming: isConfirmingCancel,
    isSuccess: isCancelSuccess,
    hash: cancelHash,
    error: cancelError,
  } = useCancelWaitlistRequest();

  const [cancellingRequestId, setCancellingRequestId] = useState<
    bigint | undefined
  >();

  // Track pending transactions for optimistic updates
  const [pendingApplications, setPendingApplications] = useState<
    Array<{
      requestId: string;
      amount: string;
      author: string;
      source: number;
      cancelled: boolean;
      valid: boolean;
      ready: boolean;
      isPending: boolean;
      txHash?: string;
    }>
  >([]);

  // Track if we've already processed the success to avoid infinite loops
  const hasProcessedSuccess = useRef(false);
  const hasProcessedCancelSuccess = useRef<string | undefined>();

  // Backend signature
  const { getSignature, isLoading: isLoadingSignature } = useBackendSignature();

  // Track source separately to calculate available balance before form is initialized
  const [selectedSource, setSelectedSource] = useState<FundsSource>(
    FundsSource.OwnBalance,
  );

  // Calculate available balance based on source using API data
  const availableBalance = useMemo(() => {
    if (!waitlistBalances) {
      // Fallback to wallet balance if API data not available
      return walletBalance?.value;
    }

    // Use the appropriate available balance based on source
    // Note: available_balance can be negative if user has more active requests than total balance
    if (selectedSource === FundsSource.OwnBalance) {
      return BigInt(waitlistBalances.available_balance);
    } else {
      // For ucDAO, use available_ucdao_balance from API
      // This can also be negative
      return BigInt(waitlistBalances.available_ucdao_balance);
    }
  }, [
    selectedSource,
    waitlistBalances?.available_balance,
    waitlistBalances?.available_ucdao_balance,
    walletBalance?.value,
  ]);

  const onSubmit = useCallback(
    async (amount: bigint, source: FundsSource) => {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      try {
        // Get backend signature (nonce is managed by backend)
        const signature = await getSignature(address, amount, source);

        // Create request on chain (nonce is managed by contract)
        await createRequestTx(amount, source, signature);
      } catch (error) {
        console.error('Failed to create request:', error);
        throw error;
      }
    },
    [address, getSignature, createRequestTx],
  );

  // Form state - initialize with available balance from API
  const {
    formState,
    setAmount,
    setSource,
    handleMaxClick,
    isValid,
    formattedAmount,
  } = useWaitlistForm({
    availableBalance: availableBalance,
    onSubmit: onSubmit,
  });

  // Sync selectedSource with formState.source and update availableBalance
  useEffect(() => {
    setSelectedSource(formState.source);
  }, [formState.source]);

  // Auto-switch to OwnBalance if ucDAO balance is 0 and ucDAO is selected
  useEffect(() => {
    if (
      formState.source === FundsSource.ucDAO &&
      waitlistBalances &&
      BigInt(waitlistBalances.ucdao) === 0n
    ) {
      setSource(FundsSource.OwnBalance);
      setSelectedSource(FundsSource.OwnBalance);
    }
  }, [formState.source, waitlistBalances, setSource]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!isValid || !formattedAmount) {
      return;
    }

    try {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      // Get backend signature (nonce is managed by backend)
      const signature = await getSignature(
        address,
        formattedAmount,
        formState.source,
      );

      // Create request on chain (nonce is managed by contract)
      const hash = await createRequestTx(
        formattedAmount,
        formState.source,
        signature,
      );

      // Add optimistic update immediately after transaction is sent
      if (hash) {
        const optimisticApp = {
          requestId: 'pending',
          amount: formattedAmount.toString(),
          author: address,
          source: formState.source,
          cancelled: false,
          valid: false,
          ready: false,
          isPending: true,
          txHash: hash,
        };
        setPendingApplications((prev) => [...prev, optimisticApp]);
        // Refetch immediately
        refetchApplications();
      }
    } catch (error) {
      console.error('Failed to create request:', error);
    }
  }, [
    isValid,
    formattedAmount,
    address,
    formState.source,
    getSignature,
    createRequestTx,
    refetchApplications,
  ]);

  // Handle cancel request
  const handleCancel = useCallback(
    async (requestId: bigint) => {
      try {
        setCancellingRequestId(requestId);
        const hash = await cancelRequestTx(requestId);

        // Optimistically remove the application from the list
        if (hash && applicationsData) {
          setPendingApplications((prev) => [
            ...prev,
            {
              requestId: requestId.toString(),
              amount: '0',
              author: address || '',
              source: 0,
              cancelled: true,
              valid: false,
              ready: false,
              isPending: true,
              txHash: hash,
            },
          ]);
        }

        // Refetch immediately after transaction is sent
        refetchApplications();
        refetchBalances();
        refetchContractState();

        // Refetch again after delay to ensure backend has processed
        setTimeout(() => {
          refetchApplications();
          refetchBalances();
          refetchContractState();
        }, 2000);
      } catch (error) {
        console.error('Failed to cancel request:', error);
      } finally {
        setCancellingRequestId(undefined);
      }
    },
    [
      cancelRequestTx,
      refetchApplications,
      refetchBalances,
      refetchContractState,
      applicationsData,
      address,
    ],
  );

  // Refetch after successful creation (transaction confirmed)
  useEffect(() => {
    if (isCreateSuccess && createHash && !hasProcessedSuccess.current) {
      // Mark as processed to prevent re-running
      hasProcessedSuccess.current = true;

      // Remove pending application with this hash
      setPendingApplications((prev) =>
        prev.filter((app) => app.txHash !== createHash),
      );

      // Reset form immediately
      setAmount('');

      // Refetch immediately
      refetchApplications();
      refetchBalances();
      refetchContractState();
      refetchBalance();

      // Refetch again after delay to ensure backend has processed the transaction
      const timeoutId1 = setTimeout(() => {
        refetchApplications();
        refetchBalances();
      }, 2000);

      // Final refetch after longer delay to ensure everything is synced
      const timeoutId2 = setTimeout(() => {
        refetchApplications();
        refetchBalances();
        refetchContractState();
      }, 5000);

      return () => {
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
      };
    }

    // Reset the flag when isCreateSuccess becomes false (new transaction started)
    if (!isCreateSuccess) {
      hasProcessedSuccess.current = false;
    }
  }, [
    isCreateSuccess,
    createHash,
    refetchApplications,
    refetchBalances,
    refetchContractState,
    refetchBalance,
    setAmount,
  ]);

  // Refetch after successful cancellation (transaction confirmed)
  useEffect(() => {
    if (
      isCancelSuccess &&
      cancelHash &&
      cancelHash !== hasProcessedCancelSuccess.current
    ) {
      hasProcessedCancelSuccess.current = cancelHash;

      // Remove pending cancellation with this hash
      setPendingApplications((prev) =>
        prev.filter((app) => app.txHash !== cancelHash),
      );

      // Refetch immediately
      refetchApplications();
      refetchBalances();
      refetchContractState();

      // Refetch again after delay to ensure backend has processed
      const timeoutId = setTimeout(() => {
        refetchApplications();
        refetchBalances();
        refetchContractState();
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [
    isCancelSuccess,
    cancelHash,
    refetchApplications,
    refetchBalances,
    refetchContractState,
  ]);

  // Switch chain handler - switch to first supported chain
  const handleSwitchChain = useCallback(async () => {
    try {
      await switchChainAsync({ chainId: WAITLIST_DEFAULT_CHAIN_ID });
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  }, [switchChainAsync]);

  const isSubmitting = isCreating || isConfirmingCreate || isLoadingSignature;
  const errorMessage =
    createError?.message || cancelError?.message || undefined;

  // Merge applications with pending ones, sort by requestId descending (newest first)
  const mergedApplications = useMemo(() => {
    type MergedApplication = Application & {
      isPending?: boolean;
      txHash?: string;
    };

    // Filter out cancelled pending apps (they should be removed from list)
    const activePendingApps = pendingApplications.filter(
      (app) => !app.cancelled || app.requestId === 'pending',
    );

    // Create a map of requestIds to track which ones are being cancelled
    const cancellingIds = new Set(
      pendingApplications
        .filter((app) => app.cancelled && app.requestId !== 'pending')
        .map((app) => app.requestId),
    );

    // Filter out applications that are being cancelled
    const activeApps = (applicationsData?.applications || []).filter(
      (app) => !cancellingIds.has(app.requestId),
    );

    const allApps: MergedApplication[] = [...activeApps, ...activePendingApps];

    // Sort by requestId descending (newest first)
    // For pending apps, put them at the top
    return allApps.sort((a, b) => {
      if (a.isPending && !b.isPending) return -1;
      if (!a.isPending && b.isPending) return 1;
      const aId =
        a.requestId === 'pending'
          ? Number.MAX_SAFE_INTEGER
          : parseInt(a.requestId, 10);
      const bId =
        b.requestId === 'pending'
          ? Number.MAX_SAFE_INTEGER
          : parseInt(b.requestId, 10);
      return bId - aId;
    });
  }, [applicationsData?.applications, pendingApplications]);

  // Calculate user aggregates (total amount and count of user's applications)
  const userAggregates = useMemo(() => {
    if (!mergedApplications || mergedApplications.length === 0) {
      return { totalAmount: 0n, totalCount: 0 };
    }

    // Filter out cancelled and pending applications for aggregates
    const activeApps = mergedApplications.filter(
      (app) => !app.cancelled && !app.isPending,
    );

    const totalAmount = activeApps.reduce((sum, app) => {
      return sum + BigInt(app.amount);
    }, 0n);

    return {
      totalAmount,
      totalCount: activeApps.length,
    };
  }, [mergedApplications]);

  return (
    <Container>
      <div className="mx-auto max-w-[1200px] px-[16px] py-[40px]">
        <div className="rounded-[12px] bg-white p-[24px] shadow-lg">
          <h1 className="mb-[24px] text-[24px] font-[600] text-[#0D0D0E]">
            Burn Waitlist
          </h1>

          {/* Display total stats before wallet connection */}
          {!isConnected && (
            <div className="mb-[24px] rounded-[8px] bg-[#F3F4F6] p-[16px]">
              <div className="grid grid-cols-2 gap-[16px]">
                <div>
                  <div className="text-[12px] text-[#6B7280]">
                    Total Applications
                  </div>
                  <div className="text-[18px] font-[600] text-[#0D0D0E]">
                    {totalCount !== undefined ? totalCount.toString() : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] text-[#6B7280]">Total Amount</div>
                  <div className="text-[18px] font-[600] text-[#0D0D0E]">
                    {totalAmount !== undefined
                      ? `${formatEther(totalAmount)} ISLM`
                      : '—'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isConnected && <WalletConnectionWarning />}

          {isConnected && (
            <>
              <StatusMessages
                currentState={currentState}
                canSubmit={canSubmit}
                canWithdraw={canWithdraw}
                paused={paused}
                isCorrectChain={isCorrectChain}
                isConnected={isConnected}
              />

              {!isCorrectChain && (
                <NetworkWarning onSwitchChain={handleSwitchChain} />
              )}

              {/* User Aggregates (5.1) */}
              <div className="mb-[24px] rounded-[8px] bg-[#F3F4F6] p-[16px]">
                <div className="grid grid-cols-2 gap-[16px]">
                  <div>
                    <div className="text-[12px] text-[#6B7280]">
                      Your Applications
                    </div>
                    <div className="text-[18px] font-[600] text-[#0D0D0E]">
                      {userAggregates.totalCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] text-[#6B7280]">
                      Your Total Amount
                    </div>
                    <div className="text-[18px] font-[600] text-[#0D0D0E]">
                      {formatEther(userAggregates.totalAmount)} ISLM
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-[32px] lg:grid-cols-2">
                {/* First Column: Form */}
                <div>
                  <h2 className="mb-[16px] text-[18px] font-[600] text-[#0D0D0E]">
                    Participate in Waitlist
                  </h2>
                  {isLoadingBalances && !waitlistBalances ? (
                    <ParticipationFormSkeleton />
                  ) : (
                    <ParticipationForm
                      amount={formState.amount}
                      source={formState.source}
                      availableBalance={availableBalance}
                      balances={waitlistBalances}
                      onAmountChange={(amount) => {
                        setAmount(amount);
                      }}
                      onSourceChange={(source) => {
                        setSource(source);
                        setSelectedSource(source);
                      }}
                      onMaxClick={() => {
                        if (availableBalance) {
                          const formatted = formatEther(availableBalance);
                          setAmount(formatted);
                        }
                      }}
                      onSubmit={handleSubmit}
                      isValid={
                        isValid &&
                        formattedAmount !== undefined &&
                        formattedAmount <= (availableBalance || 0n)
                      }
                      isSubmitting={isSubmitting}
                      error={errorMessage}
                      amountError={formState.errors.amount}
                    />
                  )}
                </div>

                {/* Second Column: Applications List */}
                {isConnected && (
                  <div>
                    <h2 className="mb-[16px] text-[18px] font-[600] text-[#0D0D0E]">
                      Your Requests
                    </h2>
                    {isLoadingApplications && !applicationsData ? (
                      <RequestsListSkeleton />
                    ) : applicationsData || pendingApplications.length > 0 ? (
                      <RequestsList
                        applications={mergedApplications}
                        canCancel={canWithdraw || false}
                        onCancel={handleCancel}
                        isCancelling={isCancelling || isConfirmingCancel}
                        cancellingRequestId={cancellingRequestId}
                        balances={waitlistBalances}
                        locale={locale}
                      />
                    ) : (
                      <div className="rounded-[8px] bg-[#F3F4F6] p-[16px] text-center">
                        <div className="text-[14px] text-[#6B7280]">
                          You haven't created any requests yet
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
