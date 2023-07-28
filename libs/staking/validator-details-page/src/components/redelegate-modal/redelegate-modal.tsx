import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useStakingActions, useToast } from '@haqq/shared';
import {
  Modal,
  ModalCloseButton,
  Button,
  MobileHeading,
  ModalInput,
} from '@haqq/shell-ui-kit';
import { Validator } from '@evmos/provider';
import { ValidatorSelect } from '../validator-select/validator-select';

export interface RedelegateModalProps {
  isOpen: boolean;
  symbol: string;
  validatorAddress: string;
  delegation: number;
  onClose: () => void;
  validatorsList: Validator[] | undefined;
}

export function RedelegateModalDetails({
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
      className={clsx(
        'flex flex-row items-center justify-between gap-[16px]',
        className,
      )}
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
  validatorAddress,
  isOpen,
  onClose,
  symbol,
  delegation,
  validatorsList,
}: RedelegateModalProps) {
  const [delegateAmount, setDelegateAmount] = useState<number | undefined>(
    undefined,
  );
  const [isRedelegateEnabled, seRedelegateEnabled] = useState(true);
  const [validatorDestinationAddress, setValidatorDestinationAddress] =
    useState<string | undefined>(undefined);
  const toast = useToast();
  const { redelegate } = useStakingActions();

  const handleMaxButtonClick = useCallback(() => {
    setDelegateAmount(delegation);
  }, [delegation]);

  const handleInputChange = useCallback((value: number | undefined) => {
    setDelegateAmount(value);
  }, []);

  const handleSubmitRedelegate = useCallback(async () => {
    if (validatorDestinationAddress && validatorAddress) {
      const redelegationPromise = redelegate(
        validatorAddress,
        validatorDestinationAddress,
        delegateAmount ?? 0,
      );

      await toast.promise(redelegationPromise, {
        loading: 'Redelegate in progress',
        success: (tx) => {
          console.log('Redelegation successful', { tx }); // maybe successful
          return `Delegation successful`;
        },
        error: (error) => {
          return error.message;
        },
      });
      onClose();
    }
  }, [
    validatorDestinationAddress,
    validatorAddress,
    redelegate,
    delegateAmount,
    toast,
    onClose,
  ]);

  const validatorsOptions = useMemo(() => {
    return (validatorsList ?? []).map((validator) => {
      return {
        label: `${validator.description.moniker}`,
        value: validator.operator_address,
      };
    });
  }, [validatorsList]);

  useEffect(() => {
    if (
      (delegateAmount && delegateAmount <= 0) ||
      (delegateAmount && delegateAmount > delegation) ||
      !(delegation > 0)
    ) {
      seRedelegateEnabled(false);
    } else {
      seRedelegateEnabled(true);
    }
  }, [delegateAmount, delegation]);

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
                <RedelegateModalDetails
                  title="My delegation"
                  value={`${delegation.toLocaleString()} ${symbol.toUpperCase()}`}
                />
              </div>
            </div>
            <div className="pt-[24px]">
              <div className="flex flex-col gap-[16px]">
                <div>
                  <ValidatorSelect
                    validators={validatorsOptions}
                    onChange={setValidatorDestinationAddress}
                  />
                </div>
                <div>
                  <ModalInput
                    symbol={symbol}
                    value={delegateAmount}
                    onChange={handleInputChange}
                    onMaxButtonClick={handleMaxButtonClick}
                    isMaxButtonDisabled={!isRedelegateEnabled}
                  />
                </div>
                <div>
                  <Button
                    variant={3}
                    onClick={handleSubmitRedelegate}
                    className="w-full"
                    disabled={!isRedelegateEnabled || !delegateAmount}
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
