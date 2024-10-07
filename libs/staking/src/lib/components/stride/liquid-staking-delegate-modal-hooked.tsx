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
  useLiquidStakingActions,
  useToast,
  useWallet,
} from '@haqq/shell-shared';
import {
  ToastLoading,
  ToastSuccess,
  ToastError,
  LinkIcon,
} from '@haqq/shell-ui-kit/server';
import { LiquidStakingDelegateModal } from './liquid-staking-delegate-modal';

export interface LiquidStakingDelegateModalProps {
  isOpen: boolean;
  symbol: string;
  balance: number;
  onClose: () => void;
  unboundingTime: number;
}

export function LiquidStakingDelegateModalHooked({
  isOpen,
  onClose,
  symbol,
  balance,
  unboundingTime,
}: LiquidStakingDelegateModalProps) {
  const { delegate } = useLiquidStakingActions();
  const [delegateAmount, setDelegateAmount] = useState<number | undefined>(
    undefined,
  );
  const [debouncedDelegateAmount, setDeboundecDelegateAmount] =
    useDebounceValue<number | undefined>(undefined, 500);
  const [fee, setFee] = useState<EstimatedFeeResponse | undefined>(undefined);
  const [isDelegateEnabled, setDelegateEnabled] = useState(false);
  const [amountError, setAmountError] = useState<undefined | 'min' | 'max'>(
    undefined,
  );
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const { isNetworkSupported } = useWallet();
  const { explorer } = getChainParams(
    isNetworkSupported && chain?.id ? chain.id : haqqMainnet.id,
  );
  const toast = useToast();
  const cancelPreviousRequest = useRef<(() => void) | null>(null);
  const posthog = usePostHog();
  const chainId = chain.id;
  const invalidateQueries = useQueryInvalidate();

  const handleSubmitDelegate = useCallback(async () => {
    try {
      if (!debouncedDelegateAmount) {
        return;
      }

      posthog.capture('delegate started', { chainId });
      setDelegateEnabled(false);
      const delegationPromise = delegate(debouncedDelegateAmount ?? 0);

      await toast.promise(
        delegationPromise,
        {
          loading: <ToastLoading>Delegation in progress</ToastLoading>,
          success: (tx) => {
            console.log('Delegation successful', { tx });
            const txHash = tx?.txhash;

            return (
              <ToastSuccess>
                <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                  <div>Delegation successful</div>
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
            return <ToastError>{error.message}</ToastError>;
          },
        },
        {
          success: {
            duration: 5000,
          },
        },
      );
      posthog.capture('delegate success', { chainId });
      onClose();
    } catch (error) {
      const message = (error as Error).message;
      posthog.capture('delegate failed', { chainId, error: message });
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
    delegate,
    debouncedDelegateAmount,
    toast,
    onClose,
    explorer.cosmos,
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

  return (
    <LiquidStakingDelegateModal
      isOpen={isOpen}
      onClose={onClose}
      symbol={symbol}
      balance={balance}
      unboundingTime={unboundingTime}
      onChange={setDelegateAmount}
      isDisabled={!isDelegateEnabled || !delegateAmount || !fee}
      amountError={amountError}
      onSubmit={handleSubmitDelegate}
      delegateAmount={delegateAmount}
    />
  );
}
