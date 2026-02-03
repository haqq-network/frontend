'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { Container } from '@haqq/shell-ui-kit/server';

import {
  useWaitlistContractState,
  useCreateWaitlistRequest,
  useCancelWaitlistRequest,
  useWaitlistBalances,
  useWaitlistApplications,
  useWaitlistPrice,
  useWaitlistPriceChart,
  useWaitlistGlobalStats,
} from './hooks';
import type { Application } from './hooks/use-waitlist-applications';
import { useBackendSignature } from './hooks/use-backend-signature';
import { useWaitlistForm } from './hooks/use-waitlist-form';
import {
  ParticipationForm,
  ParticipationFormSkeleton,
  PriceChart,
  RequestsList,
  RequestsListSkeleton,
  StatusMessages,
  WalletConnectionWarning,
  NetworkWarning,
} from './components';
import {
  FundsSource,
  RequestsState,
  WAITLIST_DEFAULT_CHAIN_ID,
} from './constants/waitlist-config';
import { formatEthDecimal } from '@haqq/shell-shared';

/**
 * Sanitizes error messages to show user-friendly messages
 */
function sanitizeErrorMessage(
  error: Error | null | undefined,
): string | undefined {
  if (!error) {
    return undefined;
  }

  // Handle error objects without message property
  const message = error instanceof Error ? error.message : String(error || '');

  if (!message || message.trim() === '') {
    return undefined;
  }

  const messageLower = message.toLowerCase();

  // User rejection errors
  if (
    messageLower.includes('user rejected') ||
    messageLower.includes('user denied') ||
    messageLower.includes('denied transaction signature') ||
    messageLower.includes('rejected the request') ||
    messageLower.includes('user rejected the request')
  ) {
    return 'Transaction rejected by user';
  }

  // Network errors
  if (messageLower.includes('network') || messageLower.includes('fetch')) {
    return 'Network error. Please check your connection and try again';
  }

  // Insufficient funds
  if (
    messageLower.includes('insufficient funds') ||
    messageLower.includes('insufficient balance')
  ) {
    return 'Insufficient balance';
  }

  // Contract execution reverted
  if (
    messageLower.includes('execution reverted') ||
    messageLower.includes('revert')
  ) {
    // Try to extract a more meaningful message if available
    const revertMatch = message.match(/execution reverted:?\s*(.+?)(?:\n|$)/i);
    if (revertMatch && revertMatch[1] && revertMatch[1].trim().length < 100) {
      return `Transaction failed: ${revertMatch[1].trim()}`;
    }
    return 'Transaction failed. Please try again';
  }

  // Transaction timeout or expired
  if (messageLower.includes('timeout') || messageLower.includes('expired')) {
    return 'Transaction timed out. Please try again';
  }

  // Return original message if no specific pattern matches, but limit length
  return message.length > 200 ? `${message.substring(0, 200)}...` : message;
}

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

  console.log('chain', chain);

  // Get balances from backend API
  const {
    data: waitlistBalances,
    isLoading: isLoadingBalances,
    refetch: refetchBalances,
  } = useWaitlistBalances(address, chain?.id);

  // Get applications from backend API
  const {
    data: applicationsData,
    isLoading: isLoadingApplications,
    refetch: refetchApplications,
  } = useWaitlistApplications({
    address: address,
    status: 'active',
    chainId: chain?.id,
  });

  // Current price (cost per token at submission)
  const { data: priceData } = useWaitlistPrice({ chainId: chain?.id });

  // Price chart data (use default chain when not connected so guests see chart)
  const {
    data: chartData,
    isLoading: isLoadingChart,
    error: chartError,
  } = useWaitlistPriceChart({
    chainId: chain?.id ?? WAITLIST_DEFAULT_CHAIN_ID,
    granularity: 'hour',
    limit: 500,
  });

  // Global stats from backend for anonymous users (contract read may not run without wallet)
  const { data: globalStats, isLoading: isLoadingGlobalStats } =
    useWaitlistGlobalStats({
      chainId: WAITLIST_DEFAULT_CHAIN_ID,
      enabled: !isConnected,
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
  // Track if we've attempted to switch chain to avoid repeated attempts
  const hasAttemptedSwitch = useRef<number | undefined>(undefined);

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
        const signature = await getSignature(
          address,
          amount,
          source,
          chain?.id,
        );

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
        chain?.id,
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
        // Refetch immediately to update balances and applications
        refetchApplications();
        refetchBalances();
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
    refetchBalances,
  ]);

  // Handle cancel request
  const handleCancel = useCallback(
    async (requestId: bigint) => {
      try {
        setCancellingRequestId(requestId);

        // Mark as cancelling immediately (before transaction is sent) to remove from UI
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
            txHash: undefined,
          },
        ]);

        const hash = await cancelRequestTx(requestId);

        // Update pending application with hash after transaction is sent
        if (hash) {
          setPendingApplications((prev) =>
            prev.map((app) =>
              app.requestId === requestId.toString() && app.cancelled
                ? { ...app, txHash: hash }
                : app,
            ),
          );
        }

        // Refetch immediately after transaction is sent (no need to wait for confirmation)
        refetchApplications();
        refetchBalances();
        refetchContractState();

        // Refetch periodically for the next 10 seconds (every 2 seconds)
        const intervalId = setInterval(() => {
          refetchApplications();
          refetchBalances();
        }, 2000);

        // Stop refetching after 10 seconds
        setTimeout(() => {
          clearInterval(intervalId);
        }, 10000);
      } catch (error) {
        console.error('Failed to cancel request:', error);
        // Remove pending cancellation on error
        setPendingApplications((prev) =>
          prev.filter(
            (app) => !(app.requestId === requestId.toString() && app.cancelled),
          ),
        );
      } finally {
        setCancellingRequestId(undefined);
      }
    },
    [
      cancelRequestTx,
      refetchApplications,
      refetchBalances,
      refetchContractState,
      address,
    ],
  );

  // Automatically remove pending applications when they appear in backend data
  // This ensures smooth transition from pending to confirmed state
  useEffect(() => {
    if (!applicationsData?.applications || pendingApplications.length === 0) {
      return;
    }

    // For each pending application, check if it appears in backend data
    setPendingApplications((prev) => {
      // Check if we need to update anything
      const hasMatchesToRemove = prev.some((pendingApp) => {
        // Only check pending creation apps (not cancelled ones)
        if (pendingApp.requestId === 'pending' && !pendingApp.cancelled) {
          // Check if we can find a matching application in the backend data
          // Match by amount (as string), source, and author
          const matchingApp = applicationsData.applications.find((app) => {
            // Normalize amounts by comparing as BigInt to handle any string formatting
            const pendingAmount = BigInt(pendingApp.amount);
            const appAmount = BigInt(app.amount);
            const amountsMatch = pendingAmount === appAmount;

            const sourcesMatch = app.source === pendingApp.source;
            const authorsMatch =
              app.author.toLowerCase() === pendingApp.author.toLowerCase();
            const notCancelled = !app.cancelled;

            return amountsMatch && sourcesMatch && authorsMatch && notCancelled;
          });

          // If found, this pending app should be removed
          return !!matchingApp;
        }

        return false;
      });

      // Only update if we found matches to remove
      if (!hasMatchesToRemove) {
        return prev;
      }

      // Filter out pending apps that now appear in backend
      return prev.filter((pendingApp) => {
        // Keep pending apps that are being cancelled
        if (pendingApp.cancelled && pendingApp.requestId !== 'pending') {
          return true; // Keep cancelled apps until they're removed from backend
        }

        // For pending creation apps, check if they appear in backend
        if (pendingApp.requestId === 'pending' && !pendingApp.cancelled) {
          // Check if we can find a matching application in the backend data
          const matchingApp = applicationsData.applications.find((app) => {
            // Normalize amounts by comparing as BigInt
            const pendingAmount = BigInt(pendingApp.amount);
            const appAmount = BigInt(app.amount);
            const amountsMatch = pendingAmount === appAmount;

            const sourcesMatch = app.source === pendingApp.source;
            const authorsMatch =
              app.author.toLowerCase() === pendingApp.author.toLowerCase();
            const notCancelled = !app.cancelled;

            return amountsMatch && sourcesMatch && authorsMatch && notCancelled;
          });

          // If found, remove the pending app (it's now in backend)
          // The backend app will be shown instead, maintaining continuity
          return !matchingApp;
        }

        // Keep other pending apps
        return true;
      });
    });
  }, [applicationsData?.applications]);

  // Refetch after successful creation (transaction confirmed)
  useEffect(() => {
    if (isCreateSuccess && createHash && !hasProcessedSuccess.current) {
      // Mark as processed to prevent re-running
      hasProcessedSuccess.current = true;

      // Reset form immediately
      setAmount('');

      // Refetch immediately
      refetchApplications();
      refetchBalances();
      refetchContractState();
      refetchBalance();

      // Refetch periodically for the next 10 seconds (every 2 seconds)
      // to ensure backend has indexed the new application
      const intervalId = setInterval(() => {
        refetchApplications();
        refetchBalances();
      }, 2000);

      // Stop refetching after 10 seconds
      const stopTimeoutId = setTimeout(() => {
        clearInterval(intervalId);
      }, 10000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(stopTimeoutId);
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

      // Refetch periodically for the next 10 seconds (every 2 seconds)
      const intervalId = setInterval(() => {
        refetchApplications();
        refetchBalances();
      }, 2000);

      // Stop refetching after 10 seconds
      const stopTimeoutId = setTimeout(() => {
        clearInterval(intervalId);
      }, 10000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(stopTimeoutId);
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
      // Mark that we've attempted to switch for this chain
      if (chain?.id) {
        hasAttemptedSwitch.current = chain.id;
      }
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  }, [switchChainAsync, chain?.id]);

  // Automatically switch to supported chain if current chain is not supported
  useEffect(() => {
    if (
      isConnected &&
      chain?.id &&
      !isCorrectChain &&
      hasAttemptedSwitch.current !== chain.id
    ) {
      // Only attempt switch once per chain (track by chain ID)
      hasAttemptedSwitch.current = chain.id;
      handleSwitchChain();
    }
  }, [isConnected, chain?.id, isCorrectChain, handleSwitchChain]);

  const isSubmitting = isCreating || isConfirmingCreate || isLoadingSignature;
  const errorMessage = useMemo(
    () => sanitizeErrorMessage(createError || cancelError || undefined),
    [createError, cancelError],
  );

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

          {/* Display total stats before wallet connection (from backend API) */}
          {!isConnected && (
            <div className="mb-[24px] rounded-[8px] bg-[#F3F4F6] p-[16px]">
              <div className="grid grid-cols-2 gap-[16px]">
                <div>
                  <div className="text-[12px] text-[#6B7280]">
                    Total Applications
                  </div>
                  <div className="text-[18px] font-[600] text-[#0D0D0E]">
                    {isLoadingGlobalStats
                      ? '—'
                      : globalStats?.totalCount !== undefined
                        ? globalStats.totalCount.toString()
                        : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] text-[#6B7280]">Total Amount</div>
                  <div className="text-[18px] font-[600] text-[#0D0D0E]">
                    {isLoadingGlobalStats
                      ? '—'
                      : globalStats?.totalAmount !== undefined
                        ? `${formatEthDecimal(BigInt(globalStats.totalAmount), 4)} ISLM`
                        : '—'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isConnected && <WalletConnectionWarning />}

          {/* Price chart - visible to all (uses default chain when not connected) */}
          <div className="mb-[24px]">
            <PriceChart
              data={chartData?.data ?? []}
              isLoading={isLoadingChart}
              error={chartError}
              priceInAtto
            />
          </div>

          {isConnected ? (
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
                <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
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
                      {formatEthDecimal(userAggregates.totalAmount, 4)} ISLM
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
                      currentPriceAtto={
                        priceData?.currentPrice != null
                          ? String(priceData.currentPrice)
                          : undefined
                      }
                      formattedAmount={formattedAmount}
                      onAmountChange={(amount) => {
                        setAmount(amount);
                      }}
                      onSourceChange={(source) => {
                        setSource(source);
                        setSelectedSource(source);
                      }}
                      onMaxClick={() => {
                        handleMaxClick();
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
                      disabled={
                        !canSubmit ||
                        currentState === RequestsState.Initialed ||
                        paused
                      }
                    />
                  )}
                </div>

                {/* Second Column: Applications List */}
                {isConnected ? (
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
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
