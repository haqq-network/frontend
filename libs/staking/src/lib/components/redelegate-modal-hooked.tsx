'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Validator } from '@evmos/provider';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import { useDebounceValue } from 'usehooks-ts';
import { formatUnits } from 'viem';
import { useAccount, useChains } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import { getChainParams } from '@haqq/data-access-cosmos';
import { type EstimatedFeeResponse } from '@haqq/data-access-falconer';
import {
  getFormattedAddress,
  useAddress,
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
} from '@haqq/shell-ui-kit/server';
import { RedelegateModal } from './redelegate-modal';
import { shouldUsePrecompile } from '../constants';
import { useRedelegationValidatorAmount } from '../hooks/use-redelegation-validator-amount';
import { splitValidators } from '../utils/split-validators';

export interface RedelegateModalProps {
  isOpen: boolean;
  symbol: string;
  validatorAddress: string;
  delegation: bigint;
  onClose: () => void;
  validatorsList: Validator[] | undefined;
  balance: bigint;
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
  const { haqqAddress, ethAddress } = useAddress();
  const { data: redelegationValidatorAmount } = useRedelegationValidatorAmount(
    haqqAddress,
    validatorAddress,
  );
  const [redelegateAmount, setRedelegateAmount] = useState<bigint | undefined>(
    undefined,
  );
  const [debouncedRedelegateAmount, setDeboundecRedelegateAmount] =
    useDebounceValue<bigint | undefined>(undefined, 500);
  const [fee, setFee] = useState<EstimatedFeeResponse | undefined>(undefined);
  const [isRedelegateEnabled, setRedelegateEnabled] = useState(false);
  const [validatorDestinationAddress, setValidatorDestinationAddress] =
    useState<string | undefined>(undefined);
  const [isFeePending, setFeePending] = useState(false);
  const toast = useToast();
  const { redelegate, getRedelegateEstimatedFee, approveStaking } =
    useStakingActions();
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
  const [amountError, setAmountError] = useState<'min' | 'max' | undefined>(
    undefined,
  );

  const handleApprove = useCallback(async () => {
    try {
      await approveStaking();
    } catch (error) {
      console.error('Approval failed:', error);
      toast.error(
        <ToastError>
          {error instanceof Error ? error.message : 'Unknown error'}
        </ToastError>,
      );
    }
  }, [approveStaking, toast]);

  const handleSubmitRedelegate = useCallback(async () => {
    try {
      if (validatorDestinationAddress && validatorAddress) {
        posthog.capture('redelegate started', {
          chainId,
          validatorAddress,
          validatorDestinationAddress,
          redelegateAmount,
          address: {
            evm: ethAddress,
            bech32: haqqAddress,
          },
        });
        setRedelegateEnabled(false);
        const redelegationPromise = redelegate(
          validatorAddress,
          validatorDestinationAddress,
          redelegateAmount ?? 0n,
          delegation,
          balance,
          memo,
          fee,
          shouldUsePrecompile,
        );

        await toast.promise(
          redelegationPromise,
          {
            loading: <ToastLoading>Redelegate in progress</ToastLoading>,
            success: (tx) => {
              console.log('Redelegation successful', { tx });
              const txHash = tx?.txhash;

              posthog.capture('redelegate success', {
                chainId,
                validatorAddress,
                validatorDestinationAddress,
                redelegateAmount,
                address: {
                  evm: ethAddress,
                  bech32: haqqAddress,
                },
              });

              return (
                <ToastSuccess>
                  <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                    <div>Redelegation successful</div>
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
              setRedelegateEnabled(true);
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
    redelegateAmount,
    ethAddress,
    haqqAddress,
    redelegate,
    balance,
    memo,
    fee,
    toast,
    onClose,
    explorerLink,
    invalidateQueries,
    chain.id,
    delegation,
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
    if (!redelegateAmount) {
      setRedelegateEnabled(false);
      setAmountError(undefined);
      setFee(undefined);
    } else if (redelegateAmount <= 0) {
      setRedelegateEnabled(false);
      setAmountError('min');
      setFee(undefined);
    } else if (redelegateAmount > delegation) {
      setRedelegateEnabled(false);
      setAmountError('max');
      setFee(undefined);
      if (cancelPreviousRequest.current) {
        cancelPreviousRequest.current();
        cancelPreviousRequest.current = null;
      }
      setFeePending(false);
    } else {
      setRedelegateEnabled(true);
      setAmountError(undefined);
    }
  }, [delegation, redelegateAmount, cancelPreviousRequest]);

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
    if (
      isRedelegateEnabled &&
      debouncedRedelegateAmount &&
      validatorDestinationAddress
    ) {
      if (
        debouncedRedelegateAmount <= 0 ||
        debouncedRedelegateAmount > delegation
      ) {
        setFee(undefined);
        setFeePending(false);
        return;
      }

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
        delegation,
        shouldUsePrecompile,
      )
        .then((estimatedFee) => {
          if (!isCancelled) {
            setFee(estimatedFee);
            setFeePending(false);
          }
        })
        .catch((error) => {
          if (!isCancelled) {
            const message = (error as Error).message;
            toast.error(<ToastError>{message}</ToastError>);
            setFee(undefined);
            setFeePending(false);
          }
        });
    }
  }, [
    validatorAddress,
    validatorDestinationAddress,
    delegation,
    cancelPreviousRequest,
    debouncedRedelegateAmount,
    getRedelegateEstimatedFee,
    isRedelegateEnabled,
    toast,
    explorerLink,
  ]);

  useEffect(() => {
    setDeboundecRedelegateAmount(redelegateAmount);
  }, [redelegateAmount, setDeboundecRedelegateAmount]);

  return (
    <RedelegateModal
      isOpen={isOpen}
      onClose={onClose}
      symbol={symbol}
      delegation={delegation - BigInt(redelegationValidatorAmount ?? 0)}
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
      fee={fee ? parseFloat(formatUnits(BigInt(fee.fee), 18)) : undefined}
      isFeePending={isFeePending}
      memo={memo}
      onMemoChange={setMemo}
      redelegationValidatorAmount={redelegationValidatorAmount}
      onApprove={handleApprove}
      amountError={amountError}
    />
  );
}
