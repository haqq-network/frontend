import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNetwork } from 'wagmi';
import {
  useStakingActions,
  useToast,
  getFormattedAddress,
  getChainParams,
  useSupportedChains,
} from '@haqq/shared';
import {
  ToastSuccess,
  ToastLoading,
  ToastError,
  LinkIcon,
  toFixedAmount,
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
  const { undelegate } = useStakingActions();
  const [undelegateAmount, setUndelegateAmount] = useState<number | undefined>(
    undefined,
  );
  const [isUndelegateEnabled, setUndelegateEnabled] = useState(true);
  const [amountError, setAmountError] = useState<undefined | 'min' | 'max'>(
    undefined,
  );
  const toast = useToast();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { explorer } = getChainParams(chain.id);

  const handleSubmitUndelegate = useCallback(async () => {
    try {
      setUndelegateEnabled(false);
      const undelegationPromise = undelegate(
        validatorAddress,
        undelegateAmount,
      );

      await toast.promise(undelegationPromise, {
        loading: <ToastLoading>Undlegation in progress</ToastLoading>,
        success: (tx) => {
          const txHash = tx?.txhash;
          console.log('Undlegation successful', { txHash });

          return (
            <ToastSuccess>
              <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                <div>Undelegation successful</div>
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
      setUndelegateEnabled(false);
    }
  }, [
    undelegate,
    validatorAddress,
    undelegateAmount,
    toast,
    onClose,
    explorer.cosmos,
  ]);

  useEffect(() => {
    const fixedDelegation = toFixedAmount(delegation, 3) ?? 0;

    if (undelegateAmount && undelegateAmount <= 0) {
      setUndelegateEnabled(false);
      setAmountError('min');
    } else if (undelegateAmount && undelegateAmount > fixedDelegation) {
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
      setUndelegateEnabled(true);
      setAmountError(undefined);
    }
  }, [isOpen]);

  return (
    <UndelegateModal
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
    />
  );
}
