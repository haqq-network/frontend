import {
  DelegateModalDetails,
  DelegateModalInput,
  DelegateModalSubmitButton,
} from '../delegate-modal/delegate-modal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStakingActions, useToast } from '@haqq/shared';
import {
  WarningMessage,
  Card,
  Heading,
  Modal,
  ModalCloseButton,
} from '@haqq/shell/ui-kit';

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
  const [undelegateAmount, setUndelegateAmount] = useState(0);
  const [isUndelegateEnabled, setUndelegateEnabled] = useState(true);
  const [amountError, setAmountError] = useState<undefined | 'min' | 'max'>(
    undefined,
  );
  const toast = useToast();

  const handleMaxButtonClick = useCallback(() => {
    setUndelegateAmount(delegation);
  }, [delegation]);

  const handleInputChange = useCallback((value: number) => {
    setUndelegateAmount(value);
  }, []);

  const handleSubmitUndelegate = useCallback(async () => {
    const undelegationPromise = undelegate(validatorAddress, undelegateAmount);

    toast
      .promise(undelegationPromise, {
        loading: 'Undlegation in progress',
        success: (txHash) => {
          console.log('Undlegation successful', { txHash });
          return `Undlegation successful`;
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
    if (undelegateAmount <= 0) {
      setUndelegateEnabled(false);
      setAmountError('min');
    } else if (undelegateAmount > delegation) {
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
      <Card className="mx-auto w-[420px] !bg-white dark:!bg-slate-700">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-row items-center justify-between">
            <Heading level={3}>Undelegate</Heading>
            <ModalCloseButton onClick={onClose} />
          </div>

          <WarningMessage>{`Attention! If in the future you want to withdraw the staked funds, it will take ${unboundingTime} day `}</WarningMessage>

          <div className="flex flex-col space-y-1">
            <DelegateModalDetails
              title="My balance"
              value={`${balance.toLocaleString()} ${symbol.toUpperCase()}`}
            />
            <DelegateModalDetails
              title="My delegation"
              value={`${delegation.toLocaleString()} ${symbol.toUpperCase()}`}
            />
          </div>

          <div>
            {/* <div className="mb-1 text-slate-400 text-base leading-6 flex flex-row justify-between">
              <label htmlFor="amount" className="cursor-pointer">
                Amount
              </label>
              <div>
                Available:{' '}
                <span className="text-slate-700 dark:text-slate-100 font-medium">
                  {delegation.toLocaleString()} {symbol.toUpperCase()}
                </span>
              </div>
            </div> */}
            <DelegateModalInput
              symbol="ISLM"
              value={undelegateAmount}
              onChange={handleInputChange}
              onMaxButtonClick={handleMaxButtonClick}
              hint={amountHint}
            />
          </div>

          <div>
            <DelegateModalSubmitButton
              onClick={handleSubmitUndelegate}
              className="w-full"
              disabled={!isUndelegateEnabled}
            >
              Proceed undelegation
            </DelegateModalSubmitButton>
          </div>
        </div>
      </Card>
    </Modal>
  );
}
