'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import {
  Button,
  ModalHeading,
  Modal,
  ModalCloseButton,
  ModalInput,
} from '@haqq/shell-ui-kit';
import { toFixedAmount } from '@haqq/shell-ui-kit/server';

export function DepositModalDetails({
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

export function ProposalDepositModal({
  isOpen,
  onClose,
  className,
  balance,
  symbol = 'ISLM',
  onSubmit,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  balance: number;
  symbol?: string;
  onSubmit: (amount: number) => void;
  isPending?: boolean;
}) {
  const { t } = useTranslate();
  const [depositAmount, setDepositAmount] = useState<number | undefined>(
    undefined,
  );
  const [isDepositEnabled, setDepositEnabled] = useState(true);
  const [amountError, setAmountError] = useState<undefined | 'min' | 'max'>(
    undefined,
  );

  const handleInputChange = useCallback((value: string | undefined) => {
    if (value) {
      const parsedValue = value.replace(/ /g, '').replace(/,/g, '');
      setDepositAmount(toFixedAmount(Number.parseFloat(parsedValue), 3));
    }
  }, []);

  const handleSubmitDelegate = useCallback(async () => {
    if (depositAmount) {
      onSubmit(depositAmount);
    }
  }, [depositAmount, onSubmit]);

  useEffect(() => {
    if (depositAmount && depositAmount <= 0) {
      setDepositEnabled(false);
      setAmountError('min');
    } else if (depositAmount && depositAmount > balance) {
      setDepositEnabled(false);
      setAmountError('max');
    } else {
      setDepositEnabled(true);
      setAmountError(undefined);
    }
  }, [balance, depositAmount]);

  const amountHint = useMemo(() => {
    if (amountError === 'min') {
      return (
        <span className="text-haqq-danger">
          {t('amount-error-min', 'Bellow minimal value', { ns: 'common' })}
        </span>
      );
    } else if (amountError === 'max') {
      return (
        <span className="text-haqq-danger">
          {t('amount-error-more-than-have', 'More than you have', {
            ns: 'common',
          })}
        </span>
      );
    }

    return undefined;
  }, [amountError, t]);

  const handleMaxButtonClick = useCallback(() => {
    setDepositAmount(balance);
  }, [balance]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className={clsx(
          'text-haqq-black mx-auto h-screen w-screen bg-white p-[16px] sm:mx-auto sm:h-auto sm:w-[430px] sm:rounded-[12px] sm:p-[36px]',
          className,
        )}
      >
        <ModalCloseButton
          onClick={onClose}
          className="absolute right-[16px] top-[16px]"
        />

        <div className="flex w-full flex-col space-y-6">
          <div className="divide-haqq-border divide-y divide-dashed">
            <div className="pb-[24px] pt-[24px] sm:pt-[4px]">
              <ModalHeading>
                {t('deposit', 'Deposit', { ns: 'common' })}
              </ModalHeading>
            </div>
            <div className="py-[24px]">
              <div className="flex flex-col gap-[8px]">
                <DepositModalDetails
                  title={t('my-balance', 'My balance', { ns: 'governance' })}
                  value={`${balance.toLocaleString()} ${symbol.toUpperCase()}`}
                />
              </div>
            </div>
            <div className="flex flex-col gap-[16px] pt-[24px]">
              <div>
                <ModalInput
                  symbol={symbol}
                  value={depositAmount}
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
                  disabled={!isDepositEnabled || !depositAmount}
                  isLoading={isPending}
                >
                  {t('confirm-delegation', 'Confirm delegation', {
                    ns: 'common',
                  })}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
