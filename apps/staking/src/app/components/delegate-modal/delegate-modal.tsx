import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Alert, Card, Heading, Modal, ModalCloseButton } from '@haqq/ui-kit';
import clsx from 'clsx';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useDelegation } from '@haqq/hooks';

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
          'text-slate-700 dark:text-slate-200 leading-8 text-base',
          titleClassName,
        )}
      >
        {title}
      </div>
      <div className={clsx('font-medium leading-8 text-lg', valueClassName)}>
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
        'bg-slate-500 text-white hover:bg-slate-500/90 ring-slate-500/40 focus:ring-4 outline-none dark:ring-slate-100/80',
        isSmall
          ? 'text-sm font-semibold px-2 py-1 rounded h-[30px]'
          : 'font-medium text-lg leading-8 px-4 py-2 rounded-md',
        'disabled:!bg-slate-500 disabled:!opacity-60 disabled:cursor-not-allowed',
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
  const { delegate } = useDelegation();
  const [delegateAmount, setDelegateAmount] = useState<number>(0);
  const [isDelegateEnabled, setDelegateEnabled] = useState(true);
  const [amountError, setAmountError] = useState<undefined | 'min' | 'max'>(
    undefined,
  );
  const handleMaxButtonClick = useCallback(() => {
    setDelegateAmount(balance);
  }, [balance]);
  const queryClient = useQueryClient();

  const handleInputChange = useCallback((value: number) => {
    setDelegateAmount(value);
  }, []);

  const handleModalClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleUpdateQueries = useCallback(() => {
    queryClient.invalidateQueries(['rewards']);
    queryClient.invalidateQueries(['delegation']);
    queryClient.invalidateQueries(['unboundings']);
  }, [queryClient]);

  const handleSubmitDelegate = useCallback(async () => {
    try {
      const txHash = await delegate(validatorAddress, delegateAmount);
      console.log('handleSubmitDelegate', { txHash });
      handleUpdateQueries();
      handleModalClose();
      // toast.success(`Delegation successful: ${txHash}`);
      toast.success(`Delegation successful`);
    } catch (error) {
      console.error((error as any).message);
      toast.error((error as any).message);
    }
  }, [
    delegate,
    validatorAddress,
    delegateAmount,
    handleUpdateQueries,
    handleModalClose,
  ]);

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
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <Card className="mx-auto w-[420px] !bg-white dark:!bg-slate-700">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-row justify-between items-center">
            <Heading level={3}>Delegate</Heading>
            <ModalCloseButton onClick={handleModalClose} />
          </div>

          <Alert
            title={`Staking will lock up your funds for ${unboundingTime} days`}
            text={`Once you undelegate your staked ISLM, you will need to wait ${unboundingTime}
              days for your tokens to be liquid`}
          />

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
            <div className="mb-1 text-slate-700 dark:text-slate-200 text-base leading-6 flex flex-row justify-between">
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
      </Card>
    </Modal>
  );
}

const DelegateModalInputComponent = styled('input')`
  appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
  }
`;

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
        <DelegateModalInputComponent
          type="number"
          id="amount"
          value={value}
          className={clsx(
            'border-2 border-slate-300 dark:border-slate-500 border-solid',
            'rounded-md outline-none px-4 py-2 w-full',
            'text-gray-700 dark:text-gray-100 leading-8 text-lg font-medium',
            'transition-all duration-100',
            'focus:ring-4 dark:ring-slate-100/50 ring-slate-500/40',
            'focus:border-slate-500 dark:focus:border-slate-50',
          )}
          placeholder="Please enter the amount"
          onChange={handleInputChange}
          step={step}
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <div className="inline-block text-base uppercase font-medium mr-2 text-slate-400 select-none">
            {symbol}
          </div>
          <DelegateModalSubmitButton isSmall onClick={onMaxButtonClick}>
            MAX
          </DelegateModalSubmitButton>
        </div>
      </div>

      <div className="mt-1 leading-[20px] h-[20px] text-xs">{hint}</div>
    </div>
  );
}
