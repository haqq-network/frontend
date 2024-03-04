import { useCallback, useEffect, useMemo, useState } from 'react';
import { Validator } from '@evmos/provider';
import { Link } from 'react-router-dom';
import { useNetwork } from 'wagmi';
import {
  getChainParams,
  getFormattedAddress,
  useDebounceValue,
  useStakingActions,
  useSupportedChains,
  useToast,
} from '@haqq/shared';
import {
  ToastSuccess,
  ToastLoading,
  ToastError,
  LinkIcon,
  toFixedAmount,
} from '@haqq/shell-ui-kit';
import { splitValidators } from '@haqq/staking/utils';
import { RedelegateModal } from './redelegate-modal';

export interface RedelegateModalProps {
  isOpen: boolean;
  symbol: string;
  validatorAddress: string;
  delegation: number;
  onClose: () => void;
  validatorsList: Validator[] | undefined;
  balance: number;
}

export function RedelegateModalHooked({
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
  const [fee, setFee] = useState<number | undefined>(undefined);
  const [isRedelegateEnabled, setRedelegateEnabled] = useState(true);
  const [validatorDestinationAddress, setValidatorDestinationAddress] =
    useState<string | undefined>(undefined);
  const toast = useToast();
  const { redelegate, getRedelegateEstimatedFee } = useStakingActions();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { explorer } = getChainParams(chain.id);

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
    balance,
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

  const debouncedRedelegateAmount = useDebounceValue(redelegateAmount, 300);

  useEffect(() => {
    if (debouncedRedelegateAmount) {
      const fixedDelegation = toFixedAmount(delegation, 3) ?? 0;

      if (
        !(fixedDelegation > 0) ||
        debouncedRedelegateAmount <= 0 ||
        debouncedRedelegateAmount > fixedDelegation
      ) {
        setRedelegateEnabled(false);
      } else {
        setRedelegateEnabled(true);
      }
    }
  }, [debouncedRedelegateAmount, delegation]);

  useEffect(() => {
    if (!isOpen) {
      setRedelegateAmount(undefined);
      setValidatorDestinationAddress(undefined);
    }
  }, [isOpen]);

  useEffect(() => {
    (async () => {
      if (
        debouncedRedelegateAmount &&
        validatorDestinationAddress &&
        isRedelegateEnabled
      ) {
        const estimatedFee = await getRedelegateEstimatedFee(
          validatorAddress,
          validatorDestinationAddress,
          debouncedRedelegateAmount,
        );

        setFee(Number.parseFloat(estimatedFee.fee) / 10 ** 18);
      }
    })();
  }, [
    debouncedRedelegateAmount,
    getRedelegateEstimatedFee,
    isRedelegateEnabled,
    validatorAddress,
    validatorDestinationAddress,
  ]);

  return (
    <RedelegateModal
      isOpen={isOpen}
      onClose={onClose}
      symbol={symbol}
      delegation={delegation}
      balance={balance}
      onChange={setRedelegateAmount}
      onSubmit={handleSubmitRedelegate}
      isDisabled={
        !isRedelegateEnabled ||
        !redelegateAmount ||
        !validatorDestinationAddress
      }
      onValidatorChange={setValidatorDestinationAddress}
      validatorsOptions={validatorsOptions}
      redelegateAmount={redelegateAmount}
      fee={fee}
    />
  );
}
