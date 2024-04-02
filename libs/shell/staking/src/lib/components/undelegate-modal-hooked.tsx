'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import { useNetwork } from 'wagmi';
import { getChainParams } from '@haqq/data-access-cosmos';
import { type EstimatedFeeResponse } from '@haqq/data-access-falconer';
import {
  useStakingActions,
  useToast,
  getFormattedAddress,
  useSupportedChains,
  useThrottle,
} from '@haqq/shell-shared';
import {
  ToastSuccess,
  ToastLoading,
  ToastError,
  LinkIcon,
} from '@haqq/shell-ui-kit';
import { UndelegateModal } from './undelegate-modal';

export interface UndelegateModalProps {
  isOpen: boolean;
  validatorAddress: string;
  symbol: string;
  balance: number;
  delegation: number;
  unboundingTime: number;
  onClose: () => void;
}

export function UndelegateModalHooked({
  isOpen,
  onClose,
  symbol,
  balance,
  delegation,
  unboundingTime,
  validatorAddress,
}: UndelegateModalProps) {
  const { undelegate, getUndelegateEstimatedFee } = useStakingActions();
  const [undelegateAmount, setUndelegateAmount] = useState<number | undefined>(
    undefined,
  );
  const [fee, setFee] = useState<EstimatedFeeResponse | undefined>(undefined);
  const [isUndelegateEnabled, setUndelegateEnabled] = useState(false);
  const [isFeePending, setFeePending] = useState(false);
  const [amountError, setAmountError] = useState<undefined | 'min' | 'max'>(
    undefined,
  );
  const toast = useToast();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { explorer } = getChainParams(
    chain.unsupported !== undefined && !chain.unsupported
      ? chain.id
      : chains[0].id,
  );
  const cancelPreviousRequest = useRef<(() => void) | null>(null);
  const throttledUndelegateAmount = useThrottle(undelegateAmount, 300);
  const posthog = usePostHog();

  const handleSubmitUndelegate = useCallback(async () => {
    try {
      posthog.capture('undelegate started');
      setUndelegateEnabled(false);
      const undelegationPromise = undelegate(
        validatorAddress,
        undelegateAmount,
        balance,
        fee,
      );

      await toast.promise(undelegationPromise, {
        loading: <ToastLoading>Undlegation in progress</ToastLoading>,
        success: (tx) => {
          console.log('Undlegation successful', { tx });
          const txHash = tx?.txhash;
          posthog.capture('undelegate success');

          return (
            <ToastSuccess>
              <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                <div>Undelegation successful</div>
                <div>
                  <Link
                    href={`${explorer.cosmos}/tx/${txHash}`}
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
          posthog.capture('undelegate failed');
          return <ToastError>{error.message}</ToastError>;
        },
      });

      onClose();
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setUndelegateEnabled(false);
    }
  }, [
    posthog,
    undelegate,
    validatorAddress,
    undelegateAmount,
    balance,
    fee,
    toast,
    onClose,
    explorer.cosmos,
  ]);

  useEffect(() => {
    if (!undelegateAmount) {
      setUndelegateEnabled(false);
      setAmountError(undefined);
      setFee(undefined);
    } else if (undelegateAmount <= 0) {
      setUndelegateEnabled(false);
      setAmountError('min');
      setFee(undefined);
    } else if (undelegateAmount > delegation) {
      setUndelegateEnabled(false);
      setAmountError('max');
      setFee(undefined);
    } else {
      setUndelegateEnabled(true);
      setAmountError(undefined);
    }
  }, [delegation, undelegateAmount]);

  useEffect(() => {
    if (!isOpen) {
      setUndelegateAmount(undefined);
      setUndelegateEnabled(false);
      setAmountError(undefined);
      setFee(undefined);
      if (cancelPreviousRequest.current) {
        cancelPreviousRequest.current();
        cancelPreviousRequest.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isUndelegateEnabled) {
      if (throttledUndelegateAmount && throttledUndelegateAmount > 0) {
        if (cancelPreviousRequest.current) {
          cancelPreviousRequest.current();
        }

        let isCancelled = false;

        cancelPreviousRequest.current = () => {
          isCancelled = true;
        };

        setFeePending(true);
        getUndelegateEstimatedFee(validatorAddress, throttledUndelegateAmount)
          .then((estimatedFee) => {
            if (!isCancelled) {
              setFee(estimatedFee);
              setFeePending(false);
            }
          })
          .catch((reason) => {
            console.error(reason);
            setFeePending(false);
          });
      }
    }
  }, [
    validatorAddress,
    cancelPreviousRequest,
    throttledUndelegateAmount,
    getUndelegateEstimatedFee,
    isUndelegateEnabled,
  ]);

  return (
    <UndelegateModal
      isOpen={isOpen}
      onClose={onClose}
      symbol={symbol}
      delegation={delegation}
      balance={balance}
      unboundingTime={unboundingTime}
      onChange={setUndelegateAmount}
      isDisabled={
        !isUndelegateEnabled || !undelegateAmount || !fee || isFeePending
      }
      amountError={amountError}
      onSubmit={handleSubmitUndelegate}
      undelegateAmount={undelegateAmount}
      fee={fee ? Number.parseFloat(fee.fee) / 10 ** 18 : undefined}
      isFeePending={isFeePending}
    />
  );
}
