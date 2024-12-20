import { ReactNode, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { formatUnits, parseUnits } from 'viem';
import { formatEthDecimal, useConnectorType } from '@haqq/shell-shared';
import {
  Modal,
  ModalCloseButton,
  Button,
  ModalHeading,
  ModalInput,
} from '@haqq/shell-ui-kit';
import {
  WarningMessage,
  formatNumber,
  toFixedAmount,
  SpinnerLoader,
  OrangeLink,
} from '@haqq/shell-ui-kit/server';
import { SafeApproveWarning } from './safe-approve-warning';

export interface DelegateModalProps {
  isOpen: boolean;
  symbol: string;
  delegation: bigint;
  balance: bigint;
  unboundingTime: number;
  validatorCommission: number;
  amountError?: 'min' | 'max';
  delegateAmount: bigint | undefined;
  isDisabled: boolean;
  fee: number | undefined;
  isFeePending: boolean;
  onClose: () => void;
  onChange: (value: bigint | undefined) => void;
  onSubmit: () => void;
  memo?: string;
  onMemoChange: (value: string) => void;
  onApprove: () => void;
}

export function DelegateModalDetails({
  title,
  value,
  className,
  titleClassName,
  valueClassName,
  isValuePending = false,
}: {
  title: string;
  value: string;
  className?: string;
  titleClassName?: string;
  valueClassName?: string;
  isValuePending?: boolean;
}) {
  return (
    <div
      className={clsx(
        'flex flex-row items-center justify-between gap-[16px]',
        className,
      )}
    >
      <div
        className={clsx(
          'font-guise text-[10px] leading-[1.2em] text-[#0D0D0E80]',
          'uppercase',
          titleClassName,
        )}
      >
        {title}
        {isValuePending && (
          <SpinnerLoader
            className="h-[8px] w-[8px]"
            wrapperClassName="ml-[8px] inline-block h-[8px] w-[8px]"
          />
        )}
      </div>
      <div
        className={clsx(
          'text-haqq-black font-clash text-[14px] font-[500] leading-[18px] md:text-[20px] md:leading-[26px]',
          isValuePending && 'animate-pulse',
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
  isOpen,
  symbol,
  delegation,
  balance,
  unboundingTime,
  validatorCommission,
  amountError,
  delegateAmount,
  isDisabled,
  fee,
  isFeePending,
  memo,
  onClose,
  onChange,
  onSubmit,
  onMemoChange,
  onApprove,
}: DelegateModalProps) {
  const [isMemoVisible, setMemoVisible] = useState(false);
  const { isSafe } = useConnectorType();

  const handleMaxButtonClick = useCallback(() => {
    onChange(balance);
  }, [balance, onChange]);

  const handleInputChange = useCallback(
    (value: string | undefined) => {
      if (value === '') {
        onChange(undefined);
      } else if (value !== undefined) {
        const parsedValue = value.replace(/ /g, '').replace(/,/g, '');
        const normalizedAmount = toFixedAmount(
          Number.parseFloat(parsedValue),
          3,
        );

        if (normalizedAmount) {
          onChange(parseUnits(normalizedAmount.toString(), 18));
        }
      } else {
        onChange(undefined);
      }
    },
    [onChange],
  );

  const amountHint = useMemo(() => {
    if (amountError === 'min') {
      return <span className="text-haqq-danger">Bellow minimal value</span>;
    } else if (amountError === 'max') {
      return <span className="text-haqq-danger">More than you have</span>;
    }

    return undefined;
  }, [amountError]);

  const delegateAmountNumber = useMemo(() => {
    if (delegateAmount) {
      return Number.parseFloat(formatUnits(delegateAmount, 18));
    }

    return undefined;
  }, [delegateAmount]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-haqq-black mx-auto h-screen w-screen bg-white p-[16px] sm:mx-auto sm:h-auto sm:w-auto sm:max-w-[430px] sm:rounded-[12px] sm:p-[36px]">
        <ModalCloseButton
          onClick={onClose}
          className="absolute right-[16px] top-[16px]"
        />

        <div className="flex w-full flex-col space-y-6">
          <div className="divide-haqq-modal-border divide-y divide-dashed">
            <div className="pb-[24px]">
              <ModalHeading className="mt-[24px] sm:mt-[4px]">
                Delegate
              </ModalHeading>
              <WarningMessage light wrapperClassName="mt-[24px]">
                {`Attention! If in the future you want to withdraw the staked funds, it will take ${unboundingTime} ${unboundingTime === 1 ? 'day' : 'days'}`}
              </WarningMessage>
            </div>

            <div className="py-[24px]">
              <div className="flex flex-col gap-[8px]">
                <DelegateModalDetails
                  title="My balance"
                  value={`${formatEthDecimal(balance)} ${symbol.toUpperCase()}`}
                />
                <DelegateModalDetails
                  title="My delegation"
                  value={`${formatEthDecimal(delegation)} ${symbol.toUpperCase()}`}
                />
                <DelegateModalDetails
                  title="Commission"
                  value={`${formatNumber(validatorCommission)}%`}
                />
              </div>
            </div>

            <div className="pt-[24px]">
              <div className="flex flex-col gap-[16px]">
                <div>
                  <ModalInput
                    symbol={symbol}
                    value={delegateAmountNumber}
                    onChange={handleInputChange}
                    onMaxButtonClick={handleMaxButtonClick}
                    hint={amountHint}
                  />
                </div>

                {!isMemoVisible ? (
                  <div className="leading-[0]">
                    <OrangeLink
                      className="!text-[12px] !font-[500] !leading-[16px]"
                      onClick={() => {
                        setMemoVisible(true);
                      }}
                    >
                      Add memo
                    </OrangeLink>
                  </div>
                ) : (
                  <div className="leading-[0]">
                    <input
                      type="text"
                      value={memo}
                      onChange={(e) => {
                        onMemoChange(e.target.value);
                      }}
                      className={clsx(
                        'w-full rounded-[6px] outline-none',
                        'transition-colors duration-100 ease-in',
                        'text-[#0D0D0E] placeholder:text-[#0D0D0E80]',
                        'px-[16px] py-[12px] text-[14px] font-[500] leading-[22px]',
                        'bg-[#E7E7E7]',
                      )}
                      placeholder="Add your memo"
                    />
                  </div>
                )}

                <div>
                  <DelegateModalDetails
                    title="Estimated fee"
                    value={`${fee ? formatNumber(fee, 0, 7) : '---'} ${symbol.toUpperCase()}`}
                    isValuePending={isFeePending}
                  />
                </div>

                {isSafe && (
                  <div className="flex w-full flex-col gap-[16px]">
                    <SafeApproveWarning />
                    <div>
                      <Button
                        onClick={onApprove}
                        variant={4}
                        className="w-full"
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                )}

                <div>
                  <Button
                    variant={3}
                    onClick={onSubmit}
                    className="w-full"
                    disabled={isDisabled}
                  >
                    Delegate
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
