'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import { useDebounceValue } from 'usehooks-ts';
import { useAccount, useChains } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import { getChainParams } from '@haqq/data-access-cosmos';
import { type EstimatedFeeResponse } from '@haqq/data-access-falconer';
import {
  getFormattedAddress,
  useQueryInvalidate,
  useAddress,
  useStakingActions,
  useToast,
  useWallet,
} from '@haqq/shell-shared';
import {
  ToastLoading,
  ToastSuccess,
  ToastError,
  LinkIcon,
} from '@haqq/shell-ui-kit/server';
import { DelegateModal } from './delegate-modal';
import { shouldUsePrecompile } from '../constants';

export interface DelegateModalProps {
  isOpen: boolean;
  symbol: string;
  validatorAddress: string;
  balance: number;
  delegation: number;
  onClose: () => void;
  unboundingTime: number;
  validatorCommission: number;
}

export function DelegateModalHooked({
  validatorAddress,
  isOpen,
  onClose,
  symbol,
  delegation,
  balance,
  unboundingTime,
  validatorCommission,
}: DelegateModalProps) {
  const { delegate, getDelegateEstimatedFee } = useStakingActions();
  const [delegateAmount, setDelegateAmount] = useState<number | undefined>(
    undefined,
  );
  const [debouncedDelegateAmount, setDeboundecDelegateAmount] =
    useDebounceValue<number | undefined>(undefined, 500);
  const [fee, setFee] = useState<EstimatedFeeResponse | undefined>(undefined);
  const [isDelegateEnabled, setDelegateEnabled] = useState(false);
  const [isFeePending, setFeePending] = useState(false);
  const [amountError, setAmountError] = useState<undefined | 'min' | 'max'>(
    undefined,
  );
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const { isNetworkSupported } = useWallet();
  const { haqqAddress, ethAddress } = useAddress();
  const { explorer } = getChainParams(
    isNetworkSupported && chain?.id ? chain.id : haqqMainnet.id,
  );
  const toast = useToast();
  const cancelPreviousRequest = useRef<(() => void) | null>(null);
  const posthog = usePostHog();
  const chainId = chain.id;
  const [memo, setMemo] = useState('');
  const invalidateQueries = useQueryInvalidate();
  const explorerLink = shouldUsePrecompile ? explorer.evm : explorer.cosmos;

  const handleSubmitDelegate = useCallback(async () => {
    try {
      posthog.capture('delegate started', {
        chainId,
        validatorAddress,
        delegateAmount,
        address: {
          evm: ethAddress,
          bech32: haqqAddress,
        },
      });
      setDelegateEnabled(false);
      const delegationPromise = delegate(
        validatorAddress,
        delegateAmount,
        balance,
        memo,
        fee,
        shouldUsePrecompile,
      );

      await toast.promise(
        delegationPromise,
        {
          loading: <ToastLoading>Delegation in progress</ToastLoading>,
          success: (tx) => {
            console.log('Delegation successful', { tx });
            const txHash = tx?.txhash;

            posthog.capture('delegate success', {
              chainId,
              validatorAddress,
              delegateAmount,
              address: {
                evm: ethAddress,
                bech32: haqqAddress,
              },
              txHash,
            });

            return (
              <ToastSuccess>
                <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                  <div>Delegation successful</div>
                  <div>
                    <Link
                      href={`${explorerLink}/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-haqq-orange hover:text-haqq-light-orange flex items-center gap-[4px] lowercase transition-colors duration-300"
                    >
                      <LinkIcon />
                      <span>{getFormattedAddress(txHash)}</span>
                    </Link>
                  </div>
                </div>
              </ToastSuccess>
            );
          },
          error: (error) => {
            return <ToastError>{error.message}</ToastError>;
          },
        },
        {
          success: {
            duration: 5000,
          },
        },
      );
      onClose();
    } catch (error) {
      const message = (error as Error).message;
      posthog.capture('delegate failed', {
        chainId,
        address: haqqAddress,
        validatorAddress,
        delegateAmount,
        error: message,
      });
      console.error(message);
    } finally {
      setDelegateEnabled(true);
      invalidateQueries([
        [chain.id, 'validators'],
        [chain.id, 'delegations'],
        [chain.id, 'rewards'],
        [chain.id, 'unboundings'],
        [chain.id, 'indexer-balance'],
      ]);
    }
  }, [
    posthog,
    chainId,
    validatorAddress,
    delegateAmount,
    ethAddress,
    haqqAddress,
    delegate,
    balance,
    memo,
    fee,
    toast,
    onClose,
    explorerLink,
    invalidateQueries,
    chain.id,
  ]);

  useEffect(() => {
    if (!delegateAmount) {
      setDelegateEnabled(false);
      setAmountError(undefined);
      setFee(undefined);
    } else if (delegateAmount <= 0) {
      setDelegateEnabled(false);
      setAmountError('min');
      setFee(undefined);
    } else if (delegateAmount > balance) {
      setDelegateEnabled(false);
      setAmountError('max');
      setFee(undefined);
    } else {
      setDelegateEnabled(true);
      setAmountError(undefined);
    }
  }, [balance, delegateAmount, fee]);

  useEffect(() => {
    if (!isOpen) {
      setDelegateAmount(undefined);
      setDelegateEnabled(false);
      setAmountError(undefined);
      setFee(undefined);
      if (cancelPreviousRequest.current) {
        cancelPreviousRequest.current();
        cancelPreviousRequest.current = null;
      }
    }
  }, [cancelPreviousRequest, isOpen, setDelegateAmount]);

  useEffect(() => {
    setDeboundecDelegateAmount(delegateAmount);
  }, [delegateAmount, setDeboundecDelegateAmount]);

  useEffect(() => {
    if (isDelegateEnabled) {
      if (debouncedDelegateAmount && debouncedDelegateAmount > 0) {
        if (cancelPreviousRequest.current) {
          cancelPreviousRequest.current();
        }

        let isCancelled = false;

        cancelPreviousRequest.current = () => {
          isCancelled = true;
        };

        setFeePending(true);
        getDelegateEstimatedFee(
          validatorAddress,
          debouncedDelegateAmount,
          shouldUsePrecompile,
        )
          .then((estimatedFee) => {
            console.log('Estimated fee', { estimatedFee });
            if (!isCancelled) {
              setFee(estimatedFee);
              setFeePending(false);
            }
          })
          .catch((error) => {
            const message = (error as Error).message;
            toast.error(<ToastError>{message}</ToastError>);
            setFeePending(false);
          });
      }
    }
  }, [
    debouncedDelegateAmount,
    getDelegateEstimatedFee,
    isDelegateEnabled,
    validatorAddress,
    cancelPreviousRequest,
    toast,
  ]);

  return (
    <DelegateModal
      isOpen={isOpen}
      onClose={onClose}
      symbol={symbol}
      delegation={delegation}
      balance={balance}
      unboundingTime={unboundingTime}
      validatorCommission={validatorCommission}
      onChange={setDelegateAmount}
      isDisabled={!isDelegateEnabled || !delegateAmount || !fee || isFeePending}
      amountError={amountError}
      onSubmit={handleSubmitDelegate}
      delegateAmount={delegateAmount}
      fee={fee ? Number.parseFloat(fee.fee) / 10 ** 18 : undefined}
      isFeePending={isFeePending}
      memo={memo}
      onMemoChange={setMemo}
    />
  );
}
