import { ReactNode, useCallback } from 'react';
import clsx from 'clsx';
import {
  Modal,
  ModalCloseButton,
  Button,
  MobileHeading,
  ModalInput,
  formatNumber,
  toFixedAmount,
} from '@haqq/shell-ui-kit';
import { DelegateModalDetails } from './delegate-modal';
import { ValidatorSelect } from './validator-select';

export interface RedelegateModalProps {
  isOpen: boolean;
  symbol: string;
  delegation: number;
  redelegateAmount: number | undefined;
  balance: number;
  isDisabled: boolean;
  fee: number | undefined;
  isFeePending: boolean;
  onClose: () => void;
  onChange: (value: number | undefined) => void;
  onSubmit: () => void;
  onValidatorChange: (validatorAddress: string | undefined) => void;
  validatorsOptions: { label: string; value: string }[];
}

export function RedelegateModalSubmitButton({
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

export function RedelegateModal({
  isOpen,
  onClose,
  symbol,
  delegation,
  redelegateAmount,
  isDisabled,
  validatorsOptions,
  fee,
  isFeePending,
  onChange,
  onSubmit,
  onValidatorChange,
}: RedelegateModalProps) {
  const handleMaxButtonClick = useCallback(() => {
    onChange(Math.floor(delegation));
  }, [delegation, onChange]);

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
          onChange(normalizedAmount);
        }
      } else {
        onChange(undefined);
      }
    },
    [onChange],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-haqq-black mx-auto h-screen w-screen bg-white p-[16px] sm:mx-auto sm:h-auto sm:w-[430px] sm:rounded-[12px] sm:p-[36px]">
        <ModalCloseButton
          onClick={onClose}
          className="absolute right-[16px] top-[16px]"
        />

        <div className="flex w-full flex-col space-y-6">
          <div className="divide-y divide-dashed divide-[#0D0D0E3D]">
            <div className="pb-[24px]">
              <MobileHeading className="mt-[24px] sm:mt-[4px]">
                Redelegate
              </MobileHeading>
            </div>

            <div className="py-[24px]">
              <div className="flex flex-col gap-[8px]">
                <DelegateModalDetails
                  title="My delegation"
                  value={`${formatNumber(delegation)} ${symbol.toUpperCase()}`}
                />
              </div>
            </div>
            <div className="pt-[24px]">
              <div className="flex flex-col gap-[16px]">
                <div>
                  <ValidatorSelect
                    validators={validatorsOptions}
                    onChange={onValidatorChange}
                  />
                </div>
                <div>
                  <ModalInput
                    symbol={symbol}
                    value={redelegateAmount}
                    onChange={handleInputChange}
                    onMaxButtonClick={handleMaxButtonClick}
                  />
                </div>

                <div>
                  <DelegateModalDetails
                    title="Estimated fee"
                    value={`${fee ? formatNumber(fee, 0, 7) : '---'} ${symbol.toUpperCase()}`}
                    isValuePending={isFeePending}
                  />
                </div>

                <div>
                  <Button
                    variant={3}
                    onClick={onSubmit}
                    className="w-full"
                    disabled={isDisabled}
                  >
                    Confirm redelegation
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
