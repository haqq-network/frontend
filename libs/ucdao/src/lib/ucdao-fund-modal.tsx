'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import Link from 'next/link';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useChains } from 'wagmi';
import { getChainParams } from '@haqq/data-access-cosmos';
import {
  getFormattedAddress,
  useAddress,
  useBankBalance,
  useDaoActions,
  useQueryInvalidate,
  useToast,
} from '@haqq/shell-shared';
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalHeading,
  ModalInput,
  ModalSelect,
} from '@haqq/shell-ui-kit';
import {
  LinkIcon,
  ToastError,
  ToastLoading,
  ToastSuccess,
  toFixedAmount,
} from '@haqq/shell-ui-kit/server';

export function FundModal({
  isOpen,
  onClose,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}) {
  const { t } = useTranslate();
  const { haqqAddress } = useAddress();
  const { data: bankBalance } = useBankBalance(haqqAddress);
  const [fundAmount, setFundAmount] = useState<number | undefined>(undefined);
  const toast = useToast();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const { fund } = useDaoActions();
  const { explorer } = getChainParams(chain.id);
  const invalidateQueries = useQueryInvalidate();
  const [isFundPending, setFundPending] = useState(false);
  const currencies = useMemo(() => {
    if (!bankBalance) {
      return [];
    }

    return bankBalance.map((balance) => {
      return {
        value: balance.denom,
        label: balance.denom.slice(1).toUpperCase(),
      };
    });
  }, []);
  const [fundSymbol, setFundSymbol] = useState<{
    value?: string;
    label?: string;
  }>(currencies[0]);

  const handleInputChange = useCallback((value: string | undefined) => {
    if (value === '') {
      setFundAmount(0);
    } else if (value !== undefined) {
      const parsedValue = value.replace(/ /g, '').replace(/,/g, '');
      const normalizedAmount = toFixedAmount(Number.parseFloat(parsedValue), 3);

      if (normalizedAmount) {
        setFundAmount(normalizedAmount);
      }
    } else {
      setFundAmount(0);
    }
  }, []);

  const handleFund = useCallback(async () => {
    if (fundSymbol?.value && fundAmount) {
      try {
        setFundPending(true);
        const amountToFund = parseUnits(fundAmount?.toString() ?? '0', 18);

        await toast.promise(
          fund(amountToFund.toString(), fundSymbol.value),
          {
            loading: (
              <ToastLoading>
                {t('transfer-progress', 'Transfer in progress', {
                  ns: 'uc-dao',
                })}
              </ToastLoading>
            ),
            success: (tx) => {
              const txHash = tx.txhash;

              return (
                <ToastSuccess>
                  <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                    <div>
                      {t('transfer-success', 'Transfer successful', {
                        ns: 'uc-dao',
                      })}
                    </div>

                    {txHash && (
                      <div>
                        <Link
                          href={`${explorer.cosmos}/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-haqq-orange hover:text-haqq-light-orange flex items-center gap-[4px] lowercase transition-colors duration-300"
                        >
                          <LinkIcon />
                          <span>{getFormattedAddress(txHash)}</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </ToastSuccess>
              );
            },
            error: (error) => {
              return <ToastError>{error.message}</ToastError>;
            },
          },
          {
            success: {
              duration: 5000,
            },
          },
        );
        onClose();
      } catch (error) {
        console.error('Error with one of the transactions:', error);
      } finally {
        invalidateQueries([
          [chain.id, 'token-pairs'],
          [chain.id, 'indexer-balance'],
          [chain.id, 'bank-balance'],
          [chain.id, 'dao-all-balances'],
        ]);
        setFundPending(false);
      }
    } else {
      console.error('Error with one of the transactions:', 'No amount or coin');
    }
  }, [fund, fundSymbol, fundAmount]);

  useEffect(() => {
    setFundAmount(0);
  }, [fundSymbol]);

  const handleMaxButtonClick = useCallback(() => {
    const maxValueCoin = bankBalance?.find((coin) => {
      return coin.denom === fundSymbol.value;
    });
    const parsedMaxVal = formatUnits(
      BigInt(maxValueCoin?.amount ?? 0n),
      18,
    ).toString();
    const normalizedAmount = toFixedAmount(
      Number.parseFloat(parsedMaxVal ?? '0'),
      3,
    );
    setFundAmount(normalizedAmount ?? 0);
  }, [fundSymbol]);

  const isFundEnabled = useMemo(() => {
    return (
      fundSymbol !== undefined && fundAmount !== undefined && fundAmount > 0
    );
  }, [isFundPending, fundAmount, fundSymbol]);

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div
        className={clsx(
          'text-haqq-black mx-auto h-screen w-screen bg-white p-[16px] sm:mx-auto sm:h-auto sm:w-[430px] sm:rounded-[12px] sm:p-[36px]',
          className,
        )}
      >
        <ModalCloseButton
          onClick={onClose}
          className="absolute right-[16px] top-[16px]"
        />

        <div className="flex w-full flex-col">
          <div className="pb-[24px] pt-[24px] sm:pt-[4px]">
            <ModalHeading>
              {t('deposit-dao', 'Deposit to DAO', { ns: 'uc-dao' })}
            </ModalHeading>
          </div>

          <div className="flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[18px]">
              <div>
                <ModalSelect
                  label={t('currency', 'Currency', { ns: 'uc-dao' })}
                  selectContainerClassName="w-full"
                  onChange={(coin) => {
                    if (coin) {
                      setFundSymbol(coin);
                    }
                  }}
                  options={currencies}
                  defaultValue={currencies[0]}
                />
              </div>
              <div className="flex flex-col gap-[8px]">
                <div>
                  <label
                    htmlFor="amount"
                    className="text-haqq-black font-guise cursor-pointer text-[13px] font-[500] leading-[22px]"
                  >
                    {t('amount', 'Amount', { ns: 'uc-dao' })}
                  </label>
                </div>
                <div>
                  <ModalInput
                    symbol=""
                    value={fundAmount}
                    onChange={handleInputChange}
                    id="amount"
                    onMaxButtonClick={handleMaxButtonClick}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-[16px]">
              <div className="flex-1">
                <Button
                  variant={3}
                  onClick={handleFund}
                  className="w-full"
                  disabled={!isFundEnabled || isFundPending}
                >
                  {t('deposit', 'Deposit', { ns: 'common' })}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
