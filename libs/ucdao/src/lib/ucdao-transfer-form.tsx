'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import Link from 'next/link';
import { isAddress } from 'viem';
import { useAccount, useChains } from 'wagmi';
import { getChainParams } from '@haqq/data-access-cosmos';
import {
  ethToHaqq,
  getFormattedAddress,
  haqqToEth,
  useAddress,
  useDaoActions,
  useDaoAllBalancesQuery,
  useIndexerBalanceQuery,
  useLiquidTokens,
  useQueryInvalidate,
  useToast,
} from '@haqq/shell-shared';
import { Button } from '@haqq/shell-ui-kit';
import {
  Container,
  Heading,
  LinkIcon,
  PlaneIcon,
  ToastError,
  ToastLoading,
  ToastSuccess,
} from '@haqq/shell-ui-kit/server';
import { ConfirmModal } from './ucdao-confirm-modal';

export function DaoTransferForm() {
  const { t } = useTranslate();
  const { haqqAddress } = useAddress();
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [targetAddress, setTargetAddress] = useState('');
  const [isAddressValid, setAddressValid] = useState(false);
  const [validatedAddress, setAValidatedAddress] = useState<string | null>(
    null,
  );
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);
  const liquidTokens = useLiquidTokens(haqqAddress);
  const toast = useToast();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const invalidateQueries = useQueryInvalidate();
  const { explorer } = getChainParams(chain.id);
  const { transfer } = useDaoActions();
  const { data: daoBalance } = useDaoAllBalancesQuery(haqqAddress);

  useEffect(() => {
    if (targetAddress.startsWith('0x')) {
      const isValidEthAddress = isAddress(targetAddress);
      if (isValidEthAddress) {
        const haqq = ethToHaqq(targetAddress);
        setAddressValid(true);
        setAValidatedAddress(haqq);
      }
    } else if (targetAddress.startsWith('haqq1')) {
      const eth = haqqToEth(targetAddress);
      const isValidAddress = isAddress(eth);
      if (isValidAddress) {
        setAddressValid(true);
        setAValidatedAddress(targetAddress);
      }
    } else {
      setAddressValid(false);
    }
  }, [targetAddress]);

  const { nativeTokenAmount, tokensSum } = useMemo(() => {
    const nativeToken = daoBalance?.find((coin) => {
      return coin.denom === 'aISLM';
    });

    const tokensSum = daoBalance
      ?.filter((coin) => {
        return coin.denom !== 'aISLM';
      })
      .reduce((acc, token) => {
        return acc + BigInt(token.amount);
      }, 0n);

    return {
      nativeTokenAmount: BigInt(nativeToken?.amount ?? 0),
      tokensSum: tokensSum ?? 0n,
    };
  }, [liquidTokens]);

  const handleConfirm = useCallback(async () => {
    setConfirmModalOpen(false);
    if (validatedAddress) {
      try {
        await toast.promise(
          transfer(validatedAddress),
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
      } catch (error) {
        console.error('Error with one of the transactions:', error);
      } finally {
        invalidateQueries([
          [chain.id, 'token-pairs'],
          [chain.id, 'indexer-balance'],
          [chain.id, 'bank-balance'],
          [chain.id, 'dao-all-balances'],
        ]);
      }
    }
  }, [validatedAddress, balances, transfer, liquidTokens]);

  if (!daoBalance || daoBalance.length === 0) {
    return null;
  }

  return (
    <div className="py-[32px] md:py-[80px]">
      <Container>
        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-row items-center">
            <PlaneIcon />
            <Heading level={3} className="mb-[-2px] ml-[8px]">
              {t('transfer-heading', 'Transfer coins ownership', {
                ns: 'uc-dao',
              })}
            </Heading>
          </div>
          <div className="flex flex-col gap-[16px] md:flex-row">
            <div className="flex flex-1 flex-col gap-[8px] md:max-w-lg">
              <div>
                <label
                  htmlFor="targetAddress"
                  className="cursor-pointer text-[13px] font-[500] leading-[22px] text-white"
                >
                  {t('address-label', 'Address', { ns: 'common' })}
                </label>
              </div>
              <div>
                <input
                  className={clsx(
                    'w-full rounded-[6px] outline-none',
                    'transition-colors duration-100 ease-in',
                    'text-white placeholder:text-[#FFFFFF3D]',
                    'px-[14px] py-[9px] text-[13px] font-[500] leading-[22px]',
                    'bg-[#252528]',
                    'w-full',
                  )}
                  type="text"
                  placeholder={t(
                    'address-placeholder',
                    'Address in EVM/Bech32 format',
                    { ns: 'uc-dao' },
                  )}
                  required
                  id="targetAddress"
                  name="targetAddress"
                  value={targetAddress}
                  onChange={(event) => {
                    setTargetAddress(event.currentTarget.value);
                  }}
                />
              </div>
            </div>
            <div className="md:pt-[32px]">
              <Button
                variant={2}
                disabled={!isAddressValid || !validatedAddress}
                onClick={() => {
                  setConfirmModalOpen(true);
                }}
                className="w-full md:min-w-[120px]"
              >
                {t('send-button', 'Send', { ns: 'common' })}
              </Button>
            </div>
          </div>
        </div>

        {validatedAddress !== null && (
          <ConfirmModal
            isOpen={isConfirmModalOpen}
            onConfirm={handleConfirm}
            address={validatedAddress}
            nativeTokenAmount={nativeTokenAmount}
            tokens={tokensSum}
            onClose={() => {
              setConfirmModalOpen(false);
            }}
          />
        )}
      </Container>
    </div>
  );
}
