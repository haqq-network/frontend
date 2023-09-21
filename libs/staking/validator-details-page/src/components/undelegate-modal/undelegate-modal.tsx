import { DelegateModalDetails } from '../delegate-modal/delegate-modal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStakingActions, useToast, toFixedAmount } from '@haqq/shared';
import {
  WarningMessage,
  Modal,
  ModalCloseButton,
  Button,
  MobileHeading,
  ModalInput,
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

    toast
      .promise(undelegationPromise, {
        loading: 'Undlegation in progress',
        success: (txHash) => {
          console.log('Undlegation successful', { txHash });
          return (
            <div className="flex flex-col gap-[8px] text-center">
              <span>Undlegation successful </span>
              <Link
                to={`https://ping.pub/haqq/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-haqq-orange hover:text-haqq-light-orange transition-colors duration-300"
              >
                Explorer link
              </Link>
            </div>
          );
        },
        error: (error) => {
          return error.message;
        },
      })
      .then(() => {
        onClose();
      });
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
