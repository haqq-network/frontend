import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  getFormattedAddress,
  toFixedAmount,
  useStakingActions,
  useToast,
} from '@haqq/shared';
import {
  WarningMessage,
  Modal,
  ModalCloseButton,
  Button,
  MobileHeading,
  ModalInput,
  ToastLoading,
  ToastSuccess,
  ToastError,
  LinkIcon,
} from '@haqq/shell-ui-kit';
import { Link } from 'react-router-dom';

export interface DelegateModalProps {
  isOpen: boolean;
  symbol: string;
  validatorAddress: string;
  balance: number;
  delegation: number;
  onClose: () => void;
  unboundingTime: number;
  validatorCommission: string;
}

export function DelegateModalDetails({
  title,
  value,
  className,
  titleClassName,
  valueClassName,
}: {
  title: string;
  value: string;
  className?: string;
  titleClassName?: string;
  valueClassName?: string;
}) {
  return (
    <div
      className={clsx('flex flex-row items-center justify-between', className)}
    >
      <div
        className={clsx(
          'font-guise text-[10px] leading-[1.2em] text-[#0D0D0E80]',
          'uppercase',
          titleClassName,
        )}
      >
        {title}
      </div>
      <div
        className={clsx(
          'text-haqq-black font-clash text-[16px] font-[500] leading-[22px] md:text-[20px] md:leading-[26px]',
          valueClassName,
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function DelegateModalSubmitButton({
  children,
  onClick,
  disabled,
  className,
  isSmall = false,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  isSmall?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'bg-slate-500 text-white outline-none ring-slate-500/40 hover:bg-slate-500/90 focus:ring-4 dark:ring-slate-100/80',
        isSmall
          ? 'h-[30px] rounded px-2 py-1 text-sm font-semibold'
          : 'rounded-md px-4 py-2 text-lg font-medium leading-8',
        'disabled:cursor-not-allowed disabled:!bg-slate-500 disabled:!opacity-60',
        'transition-all duration-100',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function DelegateModal({
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
  const toast = useToast();

  const handleMaxButtonClick = useCallback(() => {
    setDelegateAmount(toFixedAmount(balance, 3));
  }, [balance]);

  const handleInputChange = useCallback((value: string | undefined) => {
    if (value) {
      const parsedValue = value.replace(/ /g, '').replace(/,/g, '');
      setDelegateAmount(toFixedAmount(Number.parseFloat(parsedValue), 3));
    }
  }, []);
  const handleSubmitDelegate = useCallback(async () => {
    try {
      setDelegateEnabled(false);
      const delegationPromise = delegate(validatorAddress, delegateAmount);

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
                    to={`https://ping.pub/haqq/tx/${txHash}`}
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
    }
  }, [delegate, validatorAddress, delegateAmount, toast, onClose]);

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

  const amountHint = useMemo(() => {
    if (amountError === 'min') {
      return <span className="text-islamic-red-500">Bellow minimal value</span>;
    } else if (amountError === 'max') {
      return <span className="text-islamic-red-500">More than you have</span>;
    }

    return undefined;
  }, [amountError]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-haqq-black mx-auto h-screen w-screen bg-white p-[16px] sm:mx-auto sm:h-auto sm:w-auto sm:max-w-[430px] sm:rounded-[12px] sm:p-[36px]">
        <ModalCloseButton
          onClick={onClose}
          className="absolute right-[16px] top-[16px]"
        />

        <div className="flex w-full flex-col space-y-6">
          <div className="divide-y divide-dashed divide-[#0D0D0E3D]">
            <div className="pb-[24px]">
              <MobileHeading className="mt-[24px] sm:mt-[4px]">
                Delegate
              </MobileHeading>
              <WarningMessage light wrapperClassName="mt-[24px]">
                {`Attention! If in the future you want to withdraw the staked funds, it will take ${unboundingTime} day `}
              </WarningMessage>
            </div>

            <div className="py-[24px]">
              <div className="flex flex-col gap-[8px]">
                <DelegateModalDetails
                  title="My balance"
                  value={`${toFixedAmount(balance, 3)} ${symbol.toUpperCase()}`}
                />
                <DelegateModalDetails
                  title="My delegation"
                  value={`${toFixedAmount(
                    delegation,
                    3,
                  )} ${symbol.toUpperCase()}`}
                />
                <DelegateModalDetails
                  title="Comission"
                  value={`${validatorCommission}%`}
                />
              </div>
            </div>
            <div className="pt-[24px]">
              <div className="flex flex-col gap-[16px]">
                <div>
                  <ModalInput
                    symbol={symbol}
                    value={delegateAmount}
                    onChange={handleInputChange}
                    onMaxButtonClick={handleMaxButtonClick}
                    hint={amountHint}
                  />
                </div>
                <div>
                  <Button
                    variant={3}
                    onClick={handleSubmitDelegate}
                    className="w-full"
                    disabled={!isDelegateEnabled || !delegateAmount}
                  >
                    Confirm delegation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
