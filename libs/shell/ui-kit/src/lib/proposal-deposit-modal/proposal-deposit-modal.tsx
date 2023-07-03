import clsx from 'clsx';
import { MobileHeading, Modal, ModalCloseButton } from '../modal/modal';
import { Button } from '../button/button';
import { ModalInput } from '../modal-input/modal-input';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
          'font-sans text-[10px] leading-[1.2em] text-[#0D0D0E80]',
          'uppercase',
          titleClassName,
        )}
      >
        {title}
      </div>
      <div
        className={clsx(
          'text-haqq-black font-serif text-[16px] font-[500] leading-[22px] md:text-[20px] md:leading-[26px]',
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
  const [depositAmount, setDepositAmount] = useState<number | undefined>(
    undefined,
  );
  const [isDepositEnabled, setDepositEnabled] = useState(true);
  const [amountError, setAmountError] = useState<undefined | 'min' | 'max'>(
    undefined,
  );

  const handleInputChange = useCallback((value: number | undefined) => {
    setDepositAmount(value);
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
      return <span className="text-islamic-red-500">Bellow minimal value</span>;
    } else if (amountError === 'max') {
      return <span className="text-islamic-red-500">More than you have</span>;
    }

    return undefined;
  }, [amountError]);

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
          <div className="divide-y divide-dashed divide-[#0D0D0E3D]">
            <div className="pb-[24px] pt-[24px] sm:pt-[4px]">
              <MobileHeading>Deposit</MobileHeading>
            </div>
            <div className="py-[24px]">
              <div className="flex flex-col gap-[8px]">
                <DepositModalDetails
                  title="My balance"
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
                  Confirm delegation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
