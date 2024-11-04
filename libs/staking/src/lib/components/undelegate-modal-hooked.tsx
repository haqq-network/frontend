'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import { useDebounceValue } from 'usehooks-ts';
import { useAccount, useChains } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import { getChainParams } from '@haqq/data-access-cosmos';
import { type EstimatedFeeResponse } from '@haqq/data-access-falconer';
import {
  useStakingActions,
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
import { UndelegateModal } from './undelegate-modal';
import { shouldUsePrecompile } from '../constants';

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
  const { t } = useTranslate('staking');
  const { undelegate, getUndelegateEstimatedFee } = useStakingActions();
  const [undelegateAmount, setUndelegateAmount] = useState<number | undefined>(
    undefined,
  );
  const [debouncedUndelegateAmount, setDeboundecUndelegateAmount] =
    useDebounceValue<number | undefined>(undefined, 500);
  const [fee, setFee] = useState<EstimatedFeeResponse | undefined>(undefined);
  const [isUndelegateEnabled, setUndelegateEnabled] = useState(false);
  const [isFeePending, setFeePending] = useState(false);
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
  const [memo, setMemo] = useState('');
  const invalidateQueries = useQueryInvalidate();
  const explorerLink = shouldUsePrecompile ? explorer.evm : explorer.cosmos;
  const { haqqAddress, ethAddress } = useAddress();

  const handleSubmitUndelegate = useCallback(async () => {
    try {
      posthog.capture('undelegate started', {
        chainId,
        validatorAddress,
        undelegateAmount,
        address: {
          evm: ethAddress,
          bech32: haqqAddress,
        },
      });
      setUndelegateEnabled(false);
      const undelegationPromise = undelegate(
        validatorAddress,
        undelegateAmount,
        balance,
        memo,
        fee,
        shouldUsePrecompile,
      );

      await toast.promise(
        undelegationPromise,
        {
          loading: (
            <ToastLoading>
              {t('undelegation-progress', 'Undelegation in progress')}
            </ToastLoading>
          ),
          success: (tx) => {
            console.log('Undlegation successful', { tx });
            const txHash = tx?.txhash;

            posthog.capture('undelegate success', {
              chainId,
              validatorAddress,
              undelegateAmount,
              address: {
                evm: ethAddress,
                bech32: haqqAddress,
              },
            });

            return (
              <ToastSuccess>
                <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                  <div>
                    {t('undelegation-success', 'Undelegation successful')}
                  </div>
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
      posthog.capture('undelegate failed', { chainId, error: message });
      console.error(message);
    } finally {
      setUndelegateEnabled(false);
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
    undelegateAmount,
    ethAddress,
    haqqAddress,
    undelegate,
    balance,
    memo,
    fee,
    toast,
    t,
    onClose,
    invalidateQueries,
    chain.id,
    explorerLink,
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
      if (debouncedUndelegateAmount && debouncedUndelegateAmount > 0) {
        if (cancelPreviousRequest.current) {
          cancelPreviousRequest.current();
        }

        let isCancelled = false;

        cancelPreviousRequest.current = () => {
          isCancelled = true;
        };

        setFeePending(true);
        getUndelegateEstimatedFee(
          validatorAddress,
          debouncedUndelegateAmount,
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
    validatorAddress,
    cancelPreviousRequest,
    debouncedUndelegateAmount,
    getUndelegateEstimatedFee,
    isUndelegateEnabled,
    toast,
    explorerLink,
  ]);

  useEffect(() => {
    setDeboundecUndelegateAmount(undelegateAmount);
  }, [undelegateAmount, setDeboundecUndelegateAmount]);

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
      memo={memo}
      onMemoChange={setMemo}
    />
  );
}
