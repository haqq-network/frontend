import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useStakingActions, useToast } from '@haqq/shared';
import {
  WarningMessage,
  Heading,
  Modal,
  ModalCloseButton,
} from '@haqq/shell/ui-kit';

export interface DelegateModalProps {
  isOpen: boolean;
  symbol: string;
  validatorAddress: string;
  balance: number;
  delegation: number;
  onClose: () => void;
  unboundingTime: number;
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
    <div className={clsx('flex flex-row justify-between', className)}>
      <div
        className={clsx(
          'text-base leading-8 text-slate-700 dark:text-slate-200',
          titleClassName,
        )}
      >
        {title}
      </div>
      <div className={clsx('text-lg font-medium leading-8', valueClassName)}>
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
}: DelegateModalProps) {
  const { delegate } = useStakingActions();
  const [delegateAmount, setDelegateAmount] = useState<number>(0);
  const [isDelegateEnabled, setDelegateEnabled] = useState(true);
  const [amountError, setAmountError] = useState<undefined | 'min' | 'max'>(
    undefined,
  );
  const toast = useToast();

  const handleMaxButtonClick = useCallback(() => {
    setDelegateAmount(balance);
  }, [balance]);

  const handleInputChange = useCallback((value: number) => {
    setDelegateAmount(value);
  }, []);

  const handleSubmitDelegate = useCallback(async () => {
    const delegationPromise = delegate(validatorAddress, delegateAmount);

    toast
      .promise(delegationPromise, {
        loading: 'Delegate in progress',
        success: (tx) => {
          console.log('Delegation successful', { tx }); // maybe successful
          const txHash = tx?.txhash;
          console.log('Delegation successful', { txHash });
          return `Delegation successful`;
        },
        error: (error) => {
          return error.message;
        },
      })
      .then(() => {
        onClose();
      });
  }, [delegate, validatorAddress, delegateAmount, toast, onClose]);

  useEffect(() => {
    if (delegateAmount <= 0) {
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
      <div className="mx-auto w-[420px] !bg-white dark:!bg-slate-700">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-row items-center justify-between">
            <Heading level={3}>Delegate</Heading>
            <ModalCloseButton onClick={onClose} />
          </div>

          <WarningMessage>{`The funds will be undelegate within ${unboundingTime} day `}</WarningMessage>

          <div className="flex flex-col">
            <DelegateModalDetails
              title="My balance"
              value={`${balance.toLocaleString()} ${symbol.toUpperCase()}`}
            />
            <DelegateModalDetails
              title="My delegation"
              value={`${delegation.toLocaleString()} ${symbol.toUpperCase()}`}
            />
          </div>

          <div>
            <div className="mb-1 flex flex-row justify-between text-base leading-6 text-slate-700 dark:text-slate-200">
              <label htmlFor="amount" className="cursor-pointer">
                Amount
              </label>
              {/* <div>
                Available:{' '}
                <span className="text-slate-700 dark:text-slate-100 font-medium">
                  {balance.toLocaleString()} {symbol.toUpperCase()}
                </span>
              </div> */}
            </div>
            <DelegateModalInput
              symbol="ISLM"
              value={delegateAmount}
              onChange={handleInputChange}
              onMaxButtonClick={handleMaxButtonClick}
              hint={amountHint}
            />
          </div>

          <div>
            <DelegateModalSubmitButton
              onClick={handleSubmitDelegate}
              className="w-full"
              disabled={!isDelegateEnabled}
            >
              Confirm delegation
            </DelegateModalSubmitButton>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function DelegateModalInput({
  symbol,
  value,
  onChange,
  onMaxButtonClick,
  hint,
  step = 0.001,
}: {
  symbol: string;
  value: number | undefined;
  onChange: (value: number) => void;
  onMaxButtonClick: () => void;
  hint?: ReactNode;
  step?: number;
}) {
  const handleInputChange = useCallback(
    (event: any) => {
      onChange(Number.parseFloat(event.target.value));
    },
    [onChange],
  );

  useEffect(() => {
    return () => {
      onChange(0);
    };
  }, [onChange]);

  return (
    <div>
      <div className="relative">
        <input
          type="number"
          id="amount"
          value={value}
          className={clsx(
            'border-2 border-solid border-slate-300 dark:border-slate-500',
            'w-full rounded-md px-4 py-2 outline-none',
            'text-lg font-medium leading-8 text-gray-700 dark:text-gray-100',
            'transition-all duration-100',
            'ring-slate-500/40 focus:ring-4 dark:ring-slate-100/50',
            'focus:border-slate-500 dark:focus:border-slate-50',
            'bg-transparent',
          )}
          placeholder="Please enter the amount"
          onChange={handleInputChange}
          step={step}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="mr-2 inline-block select-none text-base font-medium uppercase text-slate-400">
            {symbol}
          </div>
          <DelegateModalSubmitButton isSmall onClick={onMaxButtonClick}>
            MAX
          </DelegateModalSubmitButton>
        </div>
      </div>

      <div className="mt-1 h-[20px] text-xs leading-[20px]">{hint}</div>
    </div>
  );
}
