'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import { useDebounceValue } from 'usehooks-ts';
import { useAccount, useChains } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import { getChainParams } from '@haqq/data-access-cosmos';
import {
  useLiquidStakingUndelegate,
  useToast,
  getFormattedAddress,
  useWallet,
  useQueryInvalidate,
  useAddress,
} from '@haqq/shell-shared';
import {
  ToastSuccess,
  ToastLoading,
  ToastError,
  LinkIcon,
} from '@haqq/shell-ui-kit/server';
import { LiquidStakingUndelegateModal } from './liquid-staking-undelegate-modal';

export interface LiquidStakingUndelegateModalProps {
  isOpen: boolean;
  symbol: string;
  balance: number;
  delegation: number;
  unboundingTime: number;
  onClose: () => void;
}

export function LiquidStakingUndelegateModalHooked({
  isOpen,
  onClose,
  symbol,
  balance,
  delegation,
  unboundingTime,
}: LiquidStakingUndelegateModalProps) {
  const { t } = useTranslate('stacking');
  const { undelegate, setStrideAddress, strideAddress } =
    useLiquidStakingUndelegate();
  const [undelegateAmount, setUndelegateAmount] = useState<number | undefined>(
    undefined,
  );
  const [debouncedUndelegateAmount, setDeboundecUndelegateAmount] =
    useDebounceValue<number | undefined>(undefined, 500);
  const [isUndelegateEnabled, setUndelegateEnabled] = useState(false);
  const [amountError, setAmountError] = useState<undefined | 'min' | 'max'>(
    undefined,
  );
  const toast = useToast();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const { isNetworkSupported } = useWallet();
  const { explorer } = getChainParams(
    isNetworkSupported && chain?.id ? chain.id : haqqMainnet.id,
  );
  const cancelPreviousRequest = useRef<(() => void) | null>(null);
  const posthog = usePostHog();
  const chainId = chain.id;
  const invalidateQueries = useQueryInvalidate();
  const { haqqAddress, ethAddress } = useAddress();

  const handleSubmitUndelegate = useCallback(async () => {
    try {
      posthog.capture('undelegate started', {
        chainId,
        undelegateAmount: debouncedUndelegateAmount,
        address: {
          evm: ethAddress,
          bech32: haqqAddress,
        },
        isLiquidStaking: true,
      });
      setUndelegateEnabled(false);
      const undelegationPromise = undelegate(debouncedUndelegateAmount || 0);

      await toast.promise(
        undelegationPromise,
        {
          loading: (
            <ToastLoading>
              {t('undelegation-progress', 'Undelegation in progress')}
            </ToastLoading>
          ),
          success: (tx) => {
            console.log('Undelegation successful', { tx });
            const txHash = tx?.txhash;

            if (!txHash) {
              return (
                <ToastError>
                  {t('undelegation-declined', 'Undelegation declined')}
                </ToastError>
              );
            }

            posthog.capture('undelegate success', {
              chainId,
              undelegateAmount: debouncedUndelegateAmount,
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
                  <div>
                    {t('undelegation-success', 'Undelegation successful')}
                  </div>
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
      posthog.capture('undelegate failed', {
        chainId,
        address: haqqAddress,
        undelegateAmount: debouncedUndelegateAmount,
        error: message,
        isLiquidStaking: true,
      });
      console.error(message);
    } finally {
      setUndelegateEnabled(false);
      invalidateQueries([[chain.id, 'indexer-balance']]);
    }
  }, [
    posthog,
    chainId,
    undelegate,
    toast,
    t,
    onClose,
    explorer.cosmos,
    invalidateQueries,
    chain.id,
    debouncedUndelegateAmount,
    ethAddress,
    haqqAddress,
  ]);

  useEffect(() => {
    if (!undelegateAmount) {
      setUndelegateEnabled(false);
      setAmountError(undefined);
    } else if (undelegateAmount <= 0) {
      setUndelegateEnabled(false);
      setAmountError('min');
    } else if (undelegateAmount > delegation) {
      setUndelegateEnabled(false);
      setAmountError('max');
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
      if (cancelPreviousRequest.current) {
        cancelPreviousRequest.current();
        cancelPreviousRequest.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    setDeboundecUndelegateAmount(undelegateAmount);
  }, [undelegateAmount, setDeboundecUndelegateAmount]);

  return (
    <LiquidStakingUndelegateModal
      isOpen={isOpen}
      onClose={onClose}
      symbol={symbol}
      delegation={delegation}
      balance={balance}
      unboundingTime={unboundingTime}
      onChange={setUndelegateAmount}
      isDisabled={!isUndelegateEnabled || !undelegateAmount}
      amountError={amountError}
      onSubmit={handleSubmitUndelegate}
      undelegateAmount={undelegateAmount}
      strideAddress={strideAddress}
      setStrideAddress={setStrideAddress}
    />
  );
}
