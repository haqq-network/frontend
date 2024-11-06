import { useCallback, useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import {
  Modal,
  ModalCloseButton,
  Button,
  ModalHeading,
  ModalInput,
} from '@haqq/shell-ui-kit';
import {
  WarningMessage,
  toFixedAmount,
  formatNumber,
  OrangeLink,
} from '@haqq/shell-ui-kit/server';
import { DelegateModalDetails } from './delegate-modal';

export interface UndelegateModalProps {
  isOpen: boolean;
  symbol: string;
  balance: number;
  delegation: number;
  unboundingTime: number;
  amountError?: 'min' | 'max';
  undelegateAmount: number | undefined;
  isDisabled: boolean;
  fee: number | undefined;
  isFeePending: boolean;
  onClose: () => void;
  onChange: (value: number | undefined) => void;
  onSubmit: () => void;
  memo?: string;
  onMemoChange: (value: string) => void;
}

export function UndelegateModal({
  isOpen,
  symbol,
  delegation,
  balance,
  unboundingTime,
  amountError,
  undelegateAmount,
  isDisabled,
  fee,
  isFeePending,
  memo,
  onClose,
  onChange,
  onSubmit,
  onMemoChange,
}: UndelegateModalProps) {
  const { t } = useTranslate();
  const [isMemoVisible, setMemoVisible] = useState(false);

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
          {t('amount-error-min', 'Bellow minimal value', { ns: 'staking' })}
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
                {t(
                  'funds-undelegated-in-days',
                  'The funds will be undelegated within {count, plural, one {# day} other {# days}}',
                  {
                    ns: 'staking',
                    count: unboundingTime,
                  },
                )}
              </WarningMessage>
            </div>
            <div className="py-[24px]">
              <div className="flex flex-col gap-[8px]">
                <DelegateModalDetails
                  title={t('my-balance', 'My balance', { ns: 'staking' })}
                  value={`${formatNumber(balance)} ${symbol.toUpperCase()}`}
                />
                <DelegateModalDetails
                  title={t('my-delegation', 'My delegation', { ns: 'staking' })}
                  value={`${formatNumber(delegation)} ${symbol.toUpperCase()}`}
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

                {!isMemoVisible ? (
                  <div className="leading-[0]">
                    <OrangeLink
                      className="!text-[12px] !font-[500] !leading-[16px]"
                      onClick={() => {
                        setMemoVisible(true);
                      }}
                    >
                      {t('add-memo', 'Add memo', { ns: 'common' })}
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
                      placeholder={t('memo-placeholder', 'Add your memo', {
                        ns: 'staking',
                      })}
                    />
                  </div>
                )}

                <div>
                  <DelegateModalDetails
                    title={t('estimated-fee', 'Estimated fee', {
                      ns: 'staking',
                    })}
                    value={`${fee ? formatNumber(fee, 0, 7) : '---'} ${symbol.toUpperCase()}`}
                    isValuePending={isFeePending}
                  />
                </div>

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
