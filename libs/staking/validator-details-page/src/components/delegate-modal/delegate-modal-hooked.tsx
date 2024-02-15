import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNetwork } from 'wagmi';
import {
  getChainParams,
  getFormattedAddress,
  useStakingActions,
  useSupportedChains,
  useToast,
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
  const { delegate } = useStakingActions();
  const [delegateAmount, setDelegateAmount] = useState<number | undefined>(
    undefined,
  );
  const [isDelegateEnabled, setDelegateEnabled] = useState(true);
  const [amountError, setAmountError] = useState<undefined | 'min' | 'max'>(
    undefined,
  );
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { explorer } = getChainParams(chain.id);
  const toast = useToast();

  const handleSubmitDelegate = useCallback(async () => {
    try {
      setDelegateEnabled(false);
      const delegationPromise = delegate(
        validatorAddress,
        delegateAmount,
        balance,
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
  ]);

  useEffect(() => {
    if (delegateAmount && delegateAmount <= 0) {
      setDelegateEnabled(false);
      setAmountError('min');
    } else if (delegateAmount && delegateAmount > balance) {
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
      setDelegateEnabled(true);
      setAmountError(undefined);
    }
  }, [isOpen]);

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
      isDisabled={!isDelegateEnabled || !delegateAmount}
      amountError={amountError}
      onSubmit={handleSubmitDelegate}
      delegateAmount={delegateAmount}
    />
  );
}
