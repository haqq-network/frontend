import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  getFormattedAddress,
  toFixedAmount,
  useStakingActions,
  useToast,
} from '@haqq/shared';
import {
  Modal,
  ModalCloseButton,
  Button,
  MobileHeading,
  ModalInput,
  ToastSuccess,
  ToastLoading,
  ToastError,
} from '@haqq/shell-ui-kit';
import { Validator } from '@evmos/provider';
import { ValidatorSelect } from '../validator-select/validator-select';
import { splitValidators } from '@haqq/staking/utils';
import { Link } from 'react-router-dom';

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
  const [isRedelegateEnabled, setRedelegateEnabled] = useState(true);
  const [validatorDestinationAddress, setValidatorDestinationAddress] =
    useState<string | undefined>(undefined);
  const toast = useToast();
  const { redelegate } = useStakingActions();

  const handleMaxButtonClick = useCallback(() => {
    setDelegateAmount(toFixedAmount(delegation));
  }, [delegation]);

  const handleInputChange = useCallback((value: number | undefined) => {
    setDelegateAmount(toFixedAmount(value));
  }, []);

  const handleSubmitRedelegate = useCallback(async () => {
    if (validatorDestinationAddress && validatorAddress) {
      const redelegationPromise = redelegate(
        validatorAddress,
        validatorDestinationAddress,
        delegateAmount ?? 0,
      );
      setRedelegateEnabled(false);
      await toast.promise(redelegationPromise, {
        loading: <ToastLoading>Redelegate in progress</ToastLoading>,
        success: (tx) => {
          console.log('Redelegation successful', { tx }); // maybe successful
          const txHash = tx?.txhash;
          console.log('Redelegation successful', { txHash });
          return (
            <ToastSuccess>
              <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                <span>Redelegation successful</span>
                <div>
                  <Link
                    to={`https://ping.pub/haqq/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-haqq-orange hover:text-haqq-light-orange flex items-center gap-[4px] lowercase transition-colors duration-300"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13 5.5H6C4.89543 5.5 4 6.39543 4 7.5V11.5C4 12.6046 4.89543 13.5 6 13.5H13C13.7571 13.5 14.4159 13.0793 14.7555 12.459C15.0207 11.9745 15.4477 11.5 16 11.5C16.5523 11.5 17.0128 11.9547 16.8766 12.4899C16.4361 14.2202 14.8675 15.5 13 15.5H6C3.79086 15.5 2 13.7091 2 11.5V7.5C2 5.29086 3.79086 3.5 6 3.5H13C14.8675 3.5 16.4361 4.77976 16.8766 6.51012C17.0128 7.04533 16.5523 7.5 16 7.5C15.4477 7.5 15.0207 7.02548 14.7555 6.54103C14.4159 5.92067 13.7571 5.5 13 5.5ZM18 10.5H11C10.2429 10.5 9.58407 10.9207 9.24447 11.541C8.97928 12.0255 8.55228 12.5 8 12.5C7.44772 12.5 6.98717 12.0453 7.12343 11.5101C7.56394 9.77976 9.13252 8.5 11 8.5H18C20.2091 8.5 22 10.2909 22 12.5V16.5C22 18.7091 20.2091 20.5 18 20.5H11C9.13252 20.5 7.56394 19.2202 7.12343 17.4899C6.98717 16.9547 7.44772 16.5 8 16.5C8.55228 16.5 8.97928 16.9745 9.24447 17.459C9.58406 18.0793 10.2429 18.5 11 18.5H18C19.1046 18.5 20 17.6046 20 16.5V12.5C20 11.3954 19.1046 10.5 18 10.5Z"
                        fill="currentColor"
                      />
                    </svg>
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
    const { active } = splitValidators(validatorsList ?? []);

    const withoutCurrentValidator = active.filter((validator) => {
      return validator.operator_address !== validatorAddress;
    });

    return withoutCurrentValidator.map((validator) => {
      return {
        label: `${validator.description.moniker}`,
        value: validator.operator_address,
      };
    });
  }, [validatorsList, validatorAddress]);

  useEffect(() => {
    if (delegateAmount) {
      const fixedDelegation = toFixedAmount(delegation) as number;

      if (
        !(fixedDelegation > 0) ||
        delegateAmount <= 0 ||
        delegateAmount > fixedDelegation
      ) {
        setRedelegateEnabled(false);
      } else {
        setRedelegateEnabled(true);
      }
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
                    disabled={
                      !isRedelegateEnabled ||
                      !delegateAmount ||
                      !validatorDestinationAddress
                    }
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
