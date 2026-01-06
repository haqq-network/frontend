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
import { useBackendSignature } from './hooks/use-backend-signature';
import { useWaitlistForm } from './hooks/use-waitlist-form';
import {
  ParticipationForm,
  RequestsList,
  StatusMessages,
  WalletConnectionWarning,
  NetworkWarning,
} from './components';
import {
  FundsSource,
  WAITLIST_DEFAULT_CHAIN_ID,
} from './constants/waitlist-config';

export function WaitlistPage() {
  const { address, isConnected, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  // Contract state
  const {
    currentState,
    canSubmit,
    canWithdraw,
    paused,
    isCorrectChain,
    refetchAll: refetchContractState,
  } = useWaitlistContractState();

  // Get balances from backend API
  const { data: waitlistBalances, refetch: refetchBalances } =
    useWaitlistBalances(address);

  // Get applications from backend API
  const { data: applicationsData, refetch: refetchApplications } =
    useWaitlistApplications({
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
    error: createError,
  } = useCreateWaitlistRequest();

  // Cancel request
  const {
    cancelRequest: cancelRequestTx,
    isPending: isCancelling,
    isConfirming: isConfirmingCancel,
    error: cancelError,
  } = useCancelWaitlistRequest();

  const [cancellingRequestId, setCancellingRequestId] = useState<
    bigint | undefined
  >();

  // Track if we've already processed the success to avoid infinite loops
  const hasProcessedSuccess = useRef(false);

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
      await createRequestTx(formattedAmount, formState.source, signature);
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
  ]);

  // Handle cancel request
  const handleCancel = useCallback(
    async (requestId: bigint) => {
      try {
        setCancellingRequestId(requestId);
        await cancelRequestTx(requestId);
        // Refetch requests and balances after cancellation
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
    ],
  );

  // Refetch after successful creation
  useEffect(() => {
    if (isCreateSuccess && !hasProcessedSuccess.current) {
      // Mark as processed to prevent re-running
      hasProcessedSuccess.current = true;

      // Reset form immediately
      setAmount('');

      // Refetch immediately (optimistic update)
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
    refetchApplications,
    refetchBalances,
    refetchContractState,
    refetchBalance,
    setAmount,
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

  const showForm = canSubmit && !paused && isCorrectChain;

  console.log('isValid', isValid);
  console.log('formattedAmount', formattedAmount);
  console.log('availableBalance', availableBalance);
  console.log('walletBalance', walletBalance?.value);
  console.log('isSubmitting', isSubmitting);
  return (
    <Container>
      <div className="mx-auto max-w-[1200px] px-[16px] py-[40px]">
        <div className="rounded-[12px] bg-white p-[24px] shadow-lg">
          <h1 className="mb-[24px] text-[24px] font-[600] text-[#0D0D0E]">
            Burn Waitlist
          </h1>

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

              <div className="grid grid-cols-1 gap-[32px] lg:grid-cols-2">
                {/* First Column: Form */}
                {showForm && (
                  <div>
                    <h2 className="mb-[16px] text-[18px] font-[600] text-[#0D0D0E]">
                      Participate in Waitlist
                    </h2>
                    <ParticipationForm
                      amount={formState.amount}
                      source={formState.source}
                      availableBalance={availableBalance}
                      walletBalance={walletBalance?.value}
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
                  </div>
                )}

                {/* Second Column: Applications List */}
                {isConnected && (
                  <div>
                    <h2 className="mb-[16px] text-[18px] font-[600] text-[#0D0D0E]">
                      Your Requests
                    </h2>
                    {applicationsData ? (
                      <RequestsList
                        applications={applicationsData.applications}
                        canCancel={canWithdraw || false}
                        onCancel={handleCancel}
                        isCancelling={isCancelling || isConfirmingCancel}
                        cancellingRequestId={cancellingRequestId}
                      />
                    ) : (
                      <div className="rounded-[8px] bg-[#F3F4F6] p-[16px] text-center">
                        <div className="text-[14px] text-[#6B7280]">
                          Loading applications...
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
