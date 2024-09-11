'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Validator } from '@evmos/provider';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import { useDebounceValue } from 'usehooks-ts';
import { useAccount, useChains } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import { getChainParams } from '@haqq/data-access-cosmos';
import { type EstimatedFeeResponse } from '@haqq/data-access-falconer';
import {
  getFormattedAddress,
  useStakingActions,
  useToast,
  useWallet,
  useQueryInvalidate,
} from '@haqq/shell-shared';
import {
  ToastSuccess,
  ToastLoading,
  ToastError,
  LinkIcon,
  toFixedAmount,
} from '@haqq/shell-ui-kit/server';
import { RedelegateModal } from './redelegate-modal';
import { splitValidators } from '../utils/split-validators';

export interface RedelegateModalProps {
  isOpen: boolean;
  symbol: string;
  validatorAddress: string;
  delegation: number;
  onClose: () => void;
  validatorsList: Validator[] | undefined;
  balance: number;
}

export function RedelegateModalHooked({
  validatorAddress,
  isOpen,
  onClose,
  symbol,
  delegation,
  validatorsList,
  balance,
}: RedelegateModalProps) {
  const [redelegateAmount, setRedelegateAmount] = useState<number | undefined>(
    undefined,
  );
  const [debouncedRedelegateAmount, setDeboundecRedelegateAmount] =
    useDebounceValue<number | undefined>(undefined, 500);
  const [fee, setFee] = useState<EstimatedFeeResponse | undefined>(undefined);
  const [isRedelegateEnabled, setRedelegateEnabled] = useState(false);
  const [validatorDestinationAddress, setValidatorDestinationAddress] =
    useState<string | undefined>(undefined);
  const [isFeePending, setFeePending] = useState(false);
  const toast = useToast();
  const { redelegate, getRedelegateEstimatedFee } = useStakingActions();
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

  const handleSubmitRedelegate = useCallback(async () => {
    try {
      if (validatorDestinationAddress && validatorAddress) {
        posthog.capture('redelegate started', { chainId });
        setRedelegateEnabled(false);
        const redelegationPromise = redelegate(
          validatorAddress,
          validatorDestinationAddress,
          redelegateAmount ?? 0,
          balance,
          memo,
          fee,
        );

        await toast.promise(
          redelegationPromise,
          {
            loading: <ToastLoading>Redelegate in progress</ToastLoading>,
            success: (tx) => {
              console.log('Redelegation successful', { tx });
              const txHash = tx?.txhash;

              return (
                <ToastSuccess>
                  <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                    <div>Redelegation successful</div>
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
        posthog.capture('redelegate success', { chainId });
        onClose();
      }
    } catch (error) {
      const message = (error as Error).message;
      posthog.capture('redelegate failed', { chainId, error: message });
      console.error(message);
    } finally {
      setRedelegateEnabled(true);
      invalidateQueries([
        [chain.id, 'validators'],
        [chain.id, 'delegations'],
        [chain.id, 'rewards'],
        [chain.id, 'unboundings'],
        [chain.id, 'indexer-balance'],
      ]);
    }
  }, [
    validatorDestinationAddress,
    validatorAddress,
    posthog,
    chainId,
    redelegate,
    redelegateAmount,
    balance,
    memo,
    fee,
    toast,
    onClose,
    explorer.cosmos,
    invalidateQueries,
    chain.id,
  ]);

  const validatorsOptions = useMemo(() => {
    const { active } = splitValidators(validatorsList ?? []);

    const withoutCurrentValidator = active.filter((validator) => {
      return validator.operator_address !== validatorAddress;
    });

    return withoutCurrentValidator.map((validator) => {
      return {
        label: validator.description.moniker,
        value: validator.operator_address,
      };
    });
  }, [validatorsList, validatorAddress]);

  useEffect(() => {
    if (redelegateAmount) {
      const fixedDelegation = toFixedAmount(delegation, 3) ?? 0;

      if (
        !(fixedDelegation > 0) ||
        redelegateAmount <= 0 ||
        redelegateAmount > fixedDelegation
      ) {
        setRedelegateEnabled(false);
        setFee(undefined);
      } else {
        setRedelegateEnabled(true);
      }
    } else {
      setRedelegateEnabled(false);
      setFee(undefined);
    }
  }, [redelegateAmount, delegation]);

  useEffect(() => {
    if (!isOpen) {
      setRedelegateAmount(undefined);
      setValidatorDestinationAddress(undefined);
      setFee(undefined);
      if (cancelPreviousRequest.current) {
        cancelPreviousRequest.current();
        cancelPreviousRequest.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isRedelegateEnabled) {
      if (
        debouncedRedelegateAmount &&
        debouncedRedelegateAmount > 0 &&
        validatorDestinationAddress
      ) {
        if (cancelPreviousRequest.current) {
          cancelPreviousRequest.current();
        }

        let isCancelled = false;

        cancelPreviousRequest.current = () => {
          isCancelled = true;
        };

        setFeePending(true);
        getRedelegateEstimatedFee(
          validatorAddress,
          validatorDestinationAddress,
          debouncedRedelegateAmount,
        )
          .then((estimatedFee) => {
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
    debouncedRedelegateAmount,
    validatorDestinationAddress,
    getRedelegateEstimatedFee,
    isRedelegateEnabled,
    toast,
  ]);

  useEffect(() => {
    setDeboundecRedelegateAmount(redelegateAmount);
  }, [redelegateAmount, setDeboundecRedelegateAmount]);

  return (
    <RedelegateModal
      isOpen={isOpen}
      onClose={onClose}
      symbol={symbol}
      delegation={delegation}
      balance={balance}
      onChange={setRedelegateAmount}
      onSubmit={handleSubmitRedelegate}
      isDisabled={
        !isRedelegateEnabled ||
        !redelegateAmount ||
        !validatorDestinationAddress ||
        !fee ||
        isFeePending
      }
      onValidatorChange={setValidatorDestinationAddress}
      validatorsOptions={validatorsOptions}
      redelegateAmount={redelegateAmount}
      fee={fee ? Number.parseFloat(fee.fee) / 10 ** 18 : undefined}
      isFeePending={isFeePending}
      memo={memo}
      onMemoChange={setMemo}
    />
  );
}
