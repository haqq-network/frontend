import { ReactNode, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { formatUnits, parseUnits } from 'viem';
import { useConnectorType } from '@haqq/shell-shared';
import {
  Modal,
  ModalCloseButton,
  Button,
  ModalInput,
  ModalHeading,
} from '@haqq/shell-ui-kit';
import {
  formatNumber,
  toFixedAmount,
  OrangeLink,
} from '@haqq/shell-ui-kit/server';
import { DelegateModalDetails } from './delegate-modal';
import { SafeApproveWarning } from './safe-approve-warning';
import { ValidatorSelect } from './validator-select';

export interface RedelegateModalProps {
  isOpen: boolean;
  symbol: string;
  delegation: bigint;
  redelegateAmount: bigint | undefined;
  balance: bigint;
  isDisabled: boolean;
  fee: number | undefined;
  isFeePending: boolean;
  onClose: () => void;
  onChange: (value: bigint | undefined) => void;
  onSubmit: () => void;
  onValidatorChange: (validatorAddress: string | undefined) => void;
  validatorsOptions: { label: string; value: string }[];
  memo?: string;
  onMemoChange: (value: string) => void;
  redelegationValidatorAmount: bigint | undefined;
  onApprove: () => void;
  amountError: 'min' | 'max' | undefined;
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
  memo,
  onChange,
  onSubmit,
  onValidatorChange,
  onMemoChange,
  redelegationValidatorAmount,
  onApprove,
  amountError,
}: RedelegateModalProps) {
  const [isMemoVisible, setMemoVisible] = useState(false);
  const { isSafe } = useConnectorType();

  const delegationNumber = useMemo(() => {
    return Number.parseFloat(formatUnits(BigInt(delegation), 18));
  }, [delegation]);

  const redelegationValidatorAmountNumber = useMemo(() => {
    return Number.parseFloat(
      formatUnits(BigInt(redelegationValidatorAmount ?? 0), 18),
    );
  }, [redelegationValidatorAmount]);

  const handleMaxButtonClick = useCallback(() => {
    onChange(delegation);
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

  const redelegateAmountNumber = useMemo(() => {
    if (redelegateAmount) {
      return Number.parseFloat(formatUnits(redelegateAmount, 18));
    }

    return undefined;
  }, [redelegateAmount]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-haqq-black mx-auto h-screen w-screen bg-white p-[16px] sm:mx-auto sm:h-auto sm:w-[430px] sm:rounded-[12px] sm:p-[36px]">
        <ModalCloseButton
          onClick={onClose}
          className="absolute right-[16px] top-[16px]"
        />

        <div className="flex w-full flex-col space-y-6">
          <div className="divide-haqq-modal-border divide-y divide-dashed">
            <div className="pb-[24px]">
              <ModalHeading className="mt-[24px] sm:mt-[4px]">
                Redelegate
              </ModalHeading>
            </div>

            <div className="py-[24px]">
              <div className="flex flex-col gap-[8px]">
                <DelegateModalDetails
                  title="My delegation"
                  value={`${formatNumber(delegationNumber)} ${symbol.toUpperCase()}`}
                />
              </div>
            </div>

            {redelegationValidatorAmount && (
              <div className="py-[24px]">
                <div className="flex flex-col gap-[8px]">
                  <DelegateModalDetails
                    title="Redelegation amount"
                    value={`${formatNumber(redelegationValidatorAmountNumber)} ${symbol.toUpperCase()}`}
                  />
                </div>
              </div>
            )}

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
                    value={redelegateAmountNumber}
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

                <div className="flex flex-col gap-4">
                  {isSafe && (
                    <div className="flex w-full flex-col gap-4">
                      <div>
                        <SafeApproveWarning />
                      </div>
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
