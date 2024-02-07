import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Validator } from '@evmos/provider';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useNetwork } from 'wagmi';
import {
  getChainParams,
  getFormattedAddress,
  toFixedAmount,
  useStakingActions,
  useSupportedChains,
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
  LinkIcon,
} from '@haqq/shell-ui-kit';
import { splitValidators } from '@haqq/staking/utils';
import { ValidatorSelect } from '../validator-select/validator-select';

export interface RedelegateModalProps {
  isOpen: boolean;
  symbol: string;
  validatorAddress: string;
  delegation: number;
  onClose: () => void;
  validatorsList: Validator[] | undefined;
  balance: number;
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
  balance,
}: RedelegateModalProps) {
  const [redelegateAmount, setRedelegateAmount] = useState<number | undefined>(
    undefined,
  );
  const [isRedelegateEnabled, setRedelegateEnabled] = useState(true);
  const [validatorDestinationAddress, setValidatorDestinationAddress] =
    useState<string | undefined>(undefined);
  const toast = useToast();
  const { redelegate } = useStakingActions();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { explorer } = getChainParams(chain.id);

  const handleMaxButtonClick = useCallback(() => {
    setRedelegateAmount(toFixedAmount(delegation, 3));
  }, [delegation]);

  const handleInputChange = useCallback((value: string | undefined) => {
    if (value) {
      const parsedValue = value.replace(/ /g, '').replace(/,/g, '');
      setRedelegateAmount(toFixedAmount(Number.parseFloat(parsedValue), 3));
    }
  }, []);

  const handleSubmitRedelegate = useCallback(async () => {
    try {
      if (validatorDestinationAddress && validatorAddress) {
        const redelegationPromise = redelegate(
          validatorAddress,
          validatorDestinationAddress,
          redelegateAmount ?? 0,
          balance,
        );
        setRedelegateEnabled(false);
        await toast.promise(redelegationPromise, {
          loading: <ToastLoading>Redelegate in progress</ToastLoading>,
          success: (tx) => {
            console.log('Redelegation successful', { tx });
            const txHash = tx?.txhash;

            return (
              <ToastSuccess>
                <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                  <div>Redelegation successful</div>
                  <div>
                    <Link
                      to={`${explorer.cosmos}/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-haqq-orange hover:text-haqq-light-orange flex items-center gap-[4px] lowercase transition-colors duration-300"
                    >
                      <LinkIcon />
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
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setRedelegateEnabled(true);
    }
  }, [
    validatorDestinationAddress,
    validatorAddress,
    redelegate,
    redelegateAmount,
    toast,
    onClose,
    explorer.cosmos,
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
    if (redelegateAmount) {
      const fixedDelegation = toFixedAmount(delegation) as number;

      if (
        !(fixedDelegation > 0) ||
        redelegateAmount <= 0 ||
        redelegateAmount > fixedDelegation
      ) {
        setRedelegateEnabled(false);
      } else {
        setRedelegateEnabled(true);
      }
    }
  }, [redelegateAmount, delegation]);

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
                    value={redelegateAmount}
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
                      !redelegateAmount ||
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
