import { useCallback, useMemo } from 'react';
import { useTranslate } from '@tolgee/react';
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
  toFixedAmount,
  formatNumber,
} from '@haqq/shell-ui-kit/server';
import { DelegateModalDetails } from './../delegate-modal';

export interface LiquidStakingUndelegateModalProps {
  isOpen: boolean;
  symbol: string;
  balance: number;
  delegation: number;
  unboundingTime: number;
  amountError?: 'min' | 'max';
  undelegateAmount: number | undefined;
  isDisabled: boolean;
  onClose: () => void;
  onChange: (value: number | undefined) => void;
  onSubmit: () => void;
  strideAddress: string;
  setStrideAddress: (value: string) => void;
}

export function LiquidStakingUndelegateModal({
  isOpen,
  symbol,
  delegation,
  balance,
  unboundingTime,
  amountError,
  undelegateAmount,
  isDisabled,
  onClose,
  onChange,
  onSubmit,
  strideAddress,
  setStrideAddress,
}: LiquidStakingUndelegateModalProps) {
  const { t } = useTranslate();
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
      return (
        <span className="text-haqq-danger">
          {t('amount-error-min', 'Bellow minimal value', { ns: 'common' })}
        </span>
      );
    } else if (amountError === 'max') {
      return (
        <span className="text-haqq-danger">
          {t('amount-error-more-than-delegation', 'More than your delegation', {
            ns: 'staking',
          })}
        </span>
      );
    }

    return undefined;
  }, [amountError, t]);

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
                {t('undelegate', 'Undelegate', { ns: 'common' })}
              </ModalHeading>

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
                  value={`${formatNumber(balance)} ${symbol.toUpperCase()}`}
                />
                <DelegateModalDetails
                  title="My delegation"
                  value={`${formatNumber(delegation)} ${symbol.toUpperCase()}`}
                />
              </div>
            </div>
            <div className="pt-[24px]">
              <div className="flex flex-col gap-[16px]">
                <ModalInput
                  symbol={symbol}
                  value={undelegateAmount}
                  onChange={handleInputChange}
                  onMaxButtonClick={handleMaxButtonClick}
                  hint={amountHint}
                />

                <StringInput
                  value={strideAddress}
                  onChange={setStrideAddress}
                  placeholder="Use your Stride address here"
                  hint={
                    <span className="text-haqq-danger">
                      {t(
                        'stride-address-required',
                        'Stride address is required to undelegate',
                        { ns: 'staking' },
                      )}
                    </span>
                  }
                />

                <div>
                  <Button
                    variant={3}
                    onClick={onSubmit}
                    className="w-full"
                    disabled={isDisabled}
                  >
                    {t('confirm-undelegation', 'Confirm undelegation', {
                      ns: 'staking',
                    })}
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
