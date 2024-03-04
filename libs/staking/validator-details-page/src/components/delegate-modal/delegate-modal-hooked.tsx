import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNetwork } from 'wagmi';
import {
  getChainParams,
  getFormattedAddress,
  useThrottle,
  useStakingActions,
  useSupportedChains,
  useToast,
  EstimatedFeeResponse,
  useDebounce,
} from '@haqq/shared';
import {
  ToastLoading,
  ToastSuccess,
  ToastError,
  LinkIcon,
} from '@haqq/shell-ui-kit';
import { DelegateModal } from './delegate-modal';

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
  const [fee, setFee] = useState<EstimatedFeeResponse | undefined>(undefined);
  const [isDelegateEnabled, setDelegateEnabled] = useState(true);
  const [isFeePending, setFeePending] = useState(false);
  const [amountError, setAmountError] = useState<undefined | 'min' | 'max'>(
    undefined,
  );
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { explorer } = getChainParams(chain.id);
  const toast = useToast();
  const cancelPreviousRequest = useRef<(() => void) | null>(null);
  const throttledDelegateAmount = useThrottle(delegateAmount, 300);
  const debounceFeePending = useDebounce(isFeePending, 5);

  const handleSubmitDelegate = useCallback(async () => {
    try {
      setDelegateEnabled(false);
      const delegationPromise = delegate(
        validatorAddress,
        delegateAmount,
        balance,
        fee,
      );

      await toast.promise(delegationPromise, {
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
                    to={`${explorer.cosmos}/tx/${txHash}`}
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
      });
      onClose();
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setDelegateEnabled(true);
    }
  }, [
    delegate,
    validatorAddress,
    delegateAmount,
    balance,
    toast,
    onClose,
    explorer.cosmos,
    fee,
  ]);

  useEffect(() => {
    if (!fee) {
      setDelegateEnabled(false);
    } else if (throttledDelegateAmount && throttledDelegateAmount <= 0) {
      setDelegateEnabled(false);
      setAmountError('min');
    } else if (throttledDelegateAmount && throttledDelegateAmount > balance) {
      setDelegateEnabled(false);
      setAmountError('max');
    } else {
      setDelegateEnabled(true);
      setAmountError(undefined);
    }
  }, [balance, throttledDelegateAmount, fee]);

  useEffect(() => {
    if (!isOpen) {
      setDelegateAmount(undefined);
      setDelegateEnabled(true);
      setAmountError(undefined);
      setFee(undefined);
      if (cancelPreviousRequest.current) {
        cancelPreviousRequest.current();
        cancelPreviousRequest.current = null;
      }
    }
  }, [cancelPreviousRequest, isOpen]);

  useEffect(() => {
    if (throttledDelegateAmount) {
      if (cancelPreviousRequest.current) {
        cancelPreviousRequest.current();
      }

      let isCancelled = false;

      cancelPreviousRequest.current = () => {
        isCancelled = true;
      };

      setFeePending(true);
      getDelegateEstimatedFee(validatorAddress, throttledDelegateAmount)
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
  }, [
    throttledDelegateAmount,
    getDelegateEstimatedFee,
    isDelegateEnabled,
    validatorAddress,
    cancelPreviousRequest,
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
      isDisabled={!isDelegateEnabled || !delegateAmount || !fee}
      amountError={amountError}
      onSubmit={handleSubmitDelegate}
      delegateAmount={delegateAmount}
      fee={fee ? Number.parseFloat(fee.fee) / 10 ** 18 : undefined}
      isFeePending={debounceFeePending}
    />
  );
}
