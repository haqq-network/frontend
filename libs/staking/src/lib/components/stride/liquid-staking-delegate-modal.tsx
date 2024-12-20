import { ReactNode, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import {
  Modal,
  ModalCloseButton,
  Button,
  ModalHeading,
  ModalInput,
  StringInput,
} from '@haqq/shell-ui-kit';
import {
  WarningMessage,
  formatNumber,
  toFixedAmount,
  SpinnerLoader,
} from '@haqq/shell-ui-kit/server';
import { useLiquidStakingApy } from '../../hooks/use-liquid-staking-apy';
import {
  useStIslmFormIslm,
  useStrideRates,
} from '../../hooks/use-stride-rates';

export interface LiquidStakingDelegateModalProps {
  isOpen: boolean;
  symbol: string;
  balance: number;
  unboundingTime: number;
  amountError?: 'min' | 'max';
  delegateAmount: number | undefined;
  isDisabled: boolean;
  onClose: () => void;
  onChange: (value: number | undefined) => void;
  onSubmit: () => void;
  strideAddress: string;
  setStrideAddress: (value: string) => void;
}

export const STRIDE_ADDRESS_LENGTH = 45;

export const useStrideAddressValidation = (strideAddress: string) => {
  return useMemo(() => {
    // Basic validation
    if (!strideAddress || typeof strideAddress !== 'string') {
      return false;
    }

    // Check prefix and length
    const isValidPrefix = strideAddress.startsWith('stride');
    const isValidLength = strideAddress.length === STRIDE_ADDRESS_LENGTH;

    // Check for valid bech32 characters (a-z, 0-9 only)
    const hasValidCharacters = /^[a-z0-9]+$/.test(strideAddress);

    return isValidPrefix && isValidLength && hasValidCharacters;
  }, [strideAddress]);
};

export const StrideInput = ({
  strideAddress,
  setStrideAddress,
  isValidStrideAddress,
}: {
  strideAddress: string;
  setStrideAddress: (value: string) => void;
  isValidStrideAddress: boolean;
}) => {
  return (
    <StringInput
      value={strideAddress}
      onChange={setStrideAddress}
      placeholder="Use your Stride address here"
      hint={
        !isValidStrideAddress && strideAddress ? (
          <span className="text-haqq-danger">
            Invalid Stride address format. Must start with 'stride' and be{' '}
            {STRIDE_ADDRESS_LENGTH} characters long
          </span>
        ) : !strideAddress ? (
          <span className="text-haqq-danger">
            Stride address is required to delegate
          </span>
        ) : null
      }
    />
  );
};

export function LiquidStakingDelegateModalDetails({
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

export function LiquidStakingDelegateModal({
  isOpen,
  symbol,
  balance,
  unboundingTime,
  amountError,
  delegateAmount,
  isDisabled,
  onClose,
  onChange,
  onSubmit,
  strideAddress,
  setStrideAddress,
}: LiquidStakingDelegateModalProps) {
  const handleMaxButtonClick = useCallback(() => {
    onChange(Math.floor(balance));
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
          onChange(normalizedAmount);
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

  const { stIslmFormIslm } = useStIslmFormIslm(delegateAmount || 0);

  const { data: { annualizedYield } = {} } = useStrideRates(
    delegateAmount || 0,
  );

  const { apy, strideFee, isLoading } = useLiquidStakingApy();

  const isValidStrideAddress = useStrideAddressValidation(strideAddress);

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
                <LiquidStakingDelegateModalDetails
                  title="My balance"
                  value={`${formatNumber(balance)} ${symbol.toUpperCase()}`}
                />
                <LiquidStakingDelegateModalDetails
                  title="APY"
                  isValuePending={isLoading}
                  value={`${apy}%`}
                />
                <LiquidStakingDelegateModalDetails
                  title="Commission"
                  value={`${strideFee}%`}
                />
              </div>
            </div>

            <div className="pt-[24px]">
              <div className="flex flex-col gap-[16px]">
                <ModalInput
                  symbol={symbol}
                  value={delegateAmount}
                  onChange={handleInputChange}
                  onMaxButtonClick={handleMaxButtonClick}
                  hint={amountHint}
                />
                <StrideInput
                  strideAddress={strideAddress}
                  setStrideAddress={setStrideAddress}
                  isValidStrideAddress={isValidStrideAddress}
                />

                <div className="flex flex-col items-center justify-center gap-[16px]">
                  <div className="flex flex-col items-center justify-center">
                    <div className="font-guise mb-2 text-[11px] leading-[16px] text-[#0D0D0E80] lg:text-[12px] lg:leading-[18px]">
                      What you'll get:
                    </div>
                    <div className="text-[20px] font-semibold leading-[26px]">
                      {formatNumber(stIslmFormIslm)} stISLM
                    </div>
                  </div>

                  {annualizedYield ? (
                    <div className="flex w-full flex-col items-center justify-center rounded-[4px] border-[1px] border-[#01B26E] p-[8px]">
                      <div className="font-guise mb-2 text-[11px] leading-[16px] text-[#0D0D0E80] lg:text-[12px] lg:leading-[18px]">
                        Annual percentage yield
                      </div>
                      <div className="text-[20px] font-semibold leading-[26px] text-[#01B26E]">
                        {formatNumber(annualizedYield)} stISLM
                      </div>
                    </div>
                  ) : null}
                </div>

                <div>
                  <Button
                    variant={3}
                    onClick={onSubmit}
                    className="w-full"
                    disabled={isDisabled || !isValidStrideAddress}
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
