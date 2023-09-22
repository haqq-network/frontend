import { DelegateModalDetails } from '../delegate-modal/delegate-modal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useStakingActions,
  useToast,
  toFixedAmount,
  getFormattedAddress,
} from '@haqq/shared';
import {
  WarningMessage,
  Modal,
  ModalCloseButton,
  Button,
  MobileHeading,
  ModalInput,
  ToastSuccess,
  ToastLoading,
  ToastError,
} from '@haqq/shell-ui-kit';
import { Link } from 'react-router-dom';

export interface UndelegateModalProps {
  isOpen: boolean;
  validatorAddress: string;
  symbol: string;
  balance: number;
  delegation: number;
  unboundingTime: number;
  onClose: () => void;
}

export function UndelegateModal({
  isOpen,
  onClose,
  symbol,
  balance,
  delegation,
  unboundingTime,
  validatorAddress,
}: UndelegateModalProps) {
  const { undelegate } = useStakingActions();
  const [undelegateAmount, setUndelegateAmount] = useState<number | undefined>(
    undefined,
  );
  const [isUndelegateEnabled, setUndelegateEnabled] = useState(true);
  const [amountError, setAmountError] = useState<undefined | 'min' | 'max'>(
    undefined,
  );
  const toast = useToast();

  const handleMaxButtonClick = useCallback(() => {
    setUndelegateAmount(toFixedAmount(delegation));
  }, [delegation]);

  const handleInputChange = useCallback((value: number | undefined) => {
    setUndelegateAmount(toFixedAmount(value));
  }, []);

  const handleSubmitUndelegate = useCallback(async () => {
    const undelegationPromise = undelegate(validatorAddress, undelegateAmount);
    setUndelegateEnabled(false);
    await toast.promise(undelegationPromise, {
      loading: <ToastLoading>Undlegation in progress</ToastLoading>,
      success: (txHash) => {
        console.log('Undlegation successful', { txHash });
        return (
          <ToastSuccess>
            <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
              <span>Undelegation successful</span>
              <div>
                <Link
                  to={`https://ping.pub/haqq/tx/${txHash.txhash}`}
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
                  <span>{getFormattedAddress(txHash.txhash)}</span>
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
  }, [undelegate, validatorAddress, undelegateAmount, toast, onClose]);

  useEffect(() => {
    if (undelegateAmount && undelegateAmount <= 0) {
      setUndelegateEnabled(false);
      setAmountError('min');
    } else if (undelegateAmount && undelegateAmount > delegation) {
      setUndelegateEnabled(false);
      setAmountError('max');
    } else {
      setUndelegateEnabled(true);
      setAmountError(undefined);
    }
  }, [delegation, undelegateAmount]);

  const amountHint = useMemo(() => {
    if (amountError === 'min') {
      return <span className="text-islamic-red-500">Bellow minimal value</span>;
    } else if (amountError === 'max') {
      return (
        <span className="text-islamic-red-500">More than your delegation</span>
      );
    }

    return undefined;
  }, [amountError]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-haqq-black mx-auto h-screen w-screen bg-white p-[36px] sm:mx-auto sm:h-auto sm:w-auto sm:max-w-[430px] sm:rounded-[12px]">
        <ModalCloseButton
          onClick={onClose}
          className="absolute right-[16px] top-[16px]"
        />

        <div className="flex w-full flex-col space-y-6">
          <div className="divide-y divide-dashed divide-[#0D0D0E3D]">
            <div className="pb-[24px]">
              <MobileHeading className="mt-[24px] sm:mt-[4px]">
                Undelegate
              </MobileHeading>

              <WarningMessage
                light
                className="mt-[3px]"
                wrapperClassName="mt-[24px]"
              >
                {`The funds will be undelegate within ${unboundingTime} day`}
              </WarningMessage>
            </div>
            <div className="py-[24px]">
              <div className="flex flex-col gap-[8px]">
                <DelegateModalDetails
                  title="My balance"
                  value={`${balance.toLocaleString()} ${symbol.toUpperCase()}`}
                />
                <DelegateModalDetails
                  title="My delegation"
                  value={`${delegation.toLocaleString()} ${symbol.toUpperCase()}`}
                />
              </div>
            </div>
            <div className="pt-[24px]">
              <div className="flex flex-col gap-[16px]">
                <div>
                  <ModalInput
                    symbol={symbol}
                    value={undelegateAmount}
                    onChange={handleInputChange}
                    onMaxButtonClick={handleMaxButtonClick}
                    hint={amountHint}
                  />
                </div>

                <div>
                  <Button
                    variant={3}
                    onClick={handleSubmitUndelegate}
                    className="w-full"
                    disabled={!isUndelegateEnabled || !undelegateAmount}
                  >
                    Confirm undelegation
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
