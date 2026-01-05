'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { formatEther } from 'viem';
import { Container } from '@haqq/shell-ui-kit/server';
import { useAddress, useDaoAllBalancesQuery } from '@haqq/shell-shared';
import {
  useWaitlistContractState,
  useCreateWaitlistRequest,
  useCancelWaitlistRequest,
  useUserRequestIds,
  useUserNonce,
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

  // User address conversion
  const { haqqAddress } = useAddress();

  // User wallet balance (EVM)
  const { data: walletBalance, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}` | undefined,
    chainId: chain?.id || WAITLIST_DEFAULT_CHAIN_ID,
  });

  // DAO balances (Cosmos)
  const { data: daoBalances } = useDaoAllBalancesQuery(haqqAddress);

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

  // User nonce - must be declared before onSubmit callback
  const { nonce: userNonce, refetch: refetchNonce } = useUserNonce(
    address as `0x${string}` | undefined,
  );

  // Backend signature
  const { getSignature, isLoading: isLoadingSignature } = useBackendSignature();

  const onSubmit = useCallback(
    async (amount: bigint, source: FundsSource) => {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      if (userNonce === undefined) {
        throw new Error('Nonce not available');
      }

      try {
        // Get backend signature with nonce
        const signature = await getSignature(
          address,
          amount,
          source,
          userNonce,
        );

        // Create request on chain
        await createRequestTx(amount, source, userNonce, signature);
      } catch (error) {
        console.error('Failed to create request:', error);
        throw error;
      }
    },
    [address, getSignature, createRequestTx, userNonce],
  );

  // Form state - initialize with default balance
  const {
    formState,
    setAmount,
    setSource,
    handleMaxClick,
    isValid,
    formattedAmount,
  } = useWaitlistForm({
    availableBalance: walletBalance?.value,
    onSubmit: onSubmit,
  });

  // Calculate available balance based on source
  const availableBalance = useMemo(() => {
    if (formState.source === FundsSource.OwnBalance) {
      return walletBalance?.value;
    } else {
      // For ucDAO, get the native token (aISLM) balance
      const nativeToken = daoBalances?.find((coin) => {
        return coin.denom === 'aISLM';
      });
      if (nativeToken) {
        return BigInt(nativeToken.amount);
      }
      return 0n;
    }
  }, [formState.source, walletBalance?.value, daoBalances]);

  // User requests
  const { requestIds, refetch: refetchRequestIds } = useUserRequestIds(
    address as `0x${string}` | undefined,
  );

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!isValid || !formattedAmount) {
      return;
    }

    try {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      if (userNonce === undefined) {
        throw new Error('Nonce not available');
      }

      // Get backend signature with nonce
      const signature = await getSignature(
        address,
        formattedAmount,
        formState.source,
        userNonce,
      );

      // Create request on chain
      await createRequestTx(
        formattedAmount,
        formState.source,
        userNonce,
        signature,
      );
    } catch (error) {
      console.error('Failed to create request:', error);
    }
  }, [
    isValid,
    formattedAmount,
    address,
    formState.source,
    userNonce,
    getSignature,
    createRequestTx,
  ]);

  // Handle cancel request
  const handleCancel = useCallback(
    async (requestId: bigint) => {
      try {
        setCancellingRequestId(requestId);
        await cancelRequestTx(requestId);
        // Refetch requests after cancellation
        setTimeout(() => {
          refetchRequestIds();
          refetchContractState();
        }, 2000);
      } catch (error) {
        console.error('Failed to cancel request:', error);
      } finally {
        setCancellingRequestId(undefined);
      }
    },
    [cancelRequestTx, refetchRequestIds, refetchContractState],
  );

  // Refetch after successful creation
  useEffect(() => {
    if (isCreateSuccess) {
      refetchRequestIds();
      refetchContractState();
      refetchBalance();
      refetchNonce();
      // Reset form
      setAmount('');
    }
  }, [
    isCreateSuccess,
    refetchRequestIds,
    refetchContractState,
    refetchBalance,
    refetchNonce,
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

  console.log('isConnected', isConnected);
  console.log('currentState', currentState);
  return (
    <Container>
      <div className="mx-auto max-w-[600px] py-[40px]">
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

              {showForm && (
                <div className="mb-[32px]">
                  <h2 className="mb-[16px] text-[18px] font-[600] text-[#0D0D0E]">
                    Participate in Waitlist
                  </h2>
                  <ParticipationForm
                    amount={formState.amount}
                    source={formState.source}
                    availableBalance={availableBalance}
                    walletBalance={walletBalance?.value}
                    onAmountChange={(amount) => {
                      setAmount(amount);
                    }}
                    onSourceChange={(source) => {
                      setSource(source);
                      // Reset amount when source changes
                      setAmount('');
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

              {isConnected && requestIds && requestIds.length > 0 && (
                <div className="mt-[32px]">
                  <RequestsList
                    requestIds={requestIds}
                    canCancel={canWithdraw || false}
                    onCancel={handleCancel}
                    isCancelling={isCancelling || isConfirmingCancel}
                    cancellingRequestId={cancellingRequestId}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
