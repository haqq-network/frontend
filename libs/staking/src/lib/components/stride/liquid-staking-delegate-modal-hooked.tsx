'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import { useDebounceValue } from 'usehooks-ts';
import { useChains, useAccount } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import { getChainParams } from '@haqq/data-access-cosmos';
import {
  getFormattedAddress,
  useQueryInvalidate,
  useToast,
  useWallet,
  useLiquidStakingDelegate,
  useAddress,
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
  const [delegateAmount, setDelegateAmount] = useState<number | undefined>(
    undefined,
  );
  const [debouncedDelegateAmount, setDeboundecDelegateAmount] =
    useDebounceValue<number | undefined>(undefined, 500);
  const { delegate, setStrideAddress, strideAddress } =
    useLiquidStakingDelegate();

  const [isDelegateEnabled, setDelegateEnabled] = useState(false);
  const [amountError, setAmountError] = useState<undefined | 'min' | 'max'>(
    undefined,
  );
  const { haqqAddress, ethAddress } = useAddress();
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

      posthog.capture('delegate started', {
        chainId,
        delegateAmount: debouncedDelegateAmount,
        address: {
          evm: ethAddress,
          bech32: haqqAddress,
        },
        isLiquidStaking: true,
      });
      setDelegateEnabled(false);
      const delegationPromise = delegate(debouncedDelegateAmount);

      await toast.promise(
        delegationPromise,
        {
          loading: <ToastLoading>Delegation in progress</ToastLoading>,
          success: (tx) => {
            console.log('Delegation successful', { tx });
            const txHash = tx?.txhash;

            if (!txHash) {
              return <ToastError>Delegation declined</ToastError>;
            }

            posthog.capture('delegate success', {
              chainId,
              delegateAmount: debouncedDelegateAmount,
              address: {
                evm: ethAddress,
                bech32: haqqAddress,
              },
              txHash,
              isLiquidStaking: true,
            });

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
      onClose();
    } catch (error) {
      const message = (error as Error).message;
      posthog.capture('delegate failed', {
        chainId,
        address: haqqAddress,
        delegateAmount: debouncedDelegateAmount,
        error: message,
        isLiquidStaking: true,
      });
      console.error(message);
    } finally {
      setDelegateEnabled(true);
      invalidateQueries([[chain.id, 'indexer-balance']]);
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
    ethAddress,
    haqqAddress,
  ]);

  useEffect(() => {
    if (!delegateAmount) {
      setDelegateEnabled(false);
      setAmountError(undefined);
    } else if (delegateAmount <= 0) {
      setDelegateEnabled(false);
      setAmountError('min');
    } else if (delegateAmount > balance) {
      setDelegateEnabled(false);
      setAmountError('max');
    } else {
      setDelegateEnabled(true);
      setAmountError(undefined);
    }
  }, [balance, delegateAmount]);

  useEffect(() => {
    if (!isOpen) {
      setDelegateAmount(undefined);
      setDelegateEnabled(false);
      setAmountError(undefined);

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
      isDisabled={!isDelegateEnabled || !delegateAmount}
      amountError={amountError}
      onSubmit={handleSubmitDelegate}
      delegateAmount={delegateAmount}
      strideAddress={strideAddress}
      setStrideAddress={setStrideAddress}
    />
  );
}
