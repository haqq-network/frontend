'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import {
  ethToHaqq,
  getFormattedAddress,
  haqqToEth,
  isValidEthAddress,
  isValidHaqqAddress,
  useClipboard,
  useIndexerBalanceQuery,
} from '@haqq/shell-shared';
import { Tooltip } from '@haqq/shell-ui-kit';
import {
  Container,
  CopyIcon,
  formatNumber,
  Heading,
  WalletIcon,
} from '@haqq/shell-ui-kit/server';
import { LabeledBlock } from './components/labeled-block';

const symbol = 'ISLM';

export function AddressConversionPage() {
  const { t } = useTranslate();
  const { copyText } = useClipboard();

  const [enteredAddress, setEnteredAddress] = useState('');
  const [convertedAddress, setConvertedAddress] = useState('');
  const [validHaqqAddress, setValidHaqqAddress] = useState('');
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [inputError, setInputError] = useState('');

  const { data: balances } = useIndexerBalanceQuery(validHaqqAddress);
  const balance = balances?.balance;

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEnteredAddress(event.target.value);
  };

  const handleValidateAddress = useCallback(() => {
    if (enteredAddress) {
      if (isValidHaqqAddress(enteredAddress)) {
        setConvertedAddress(haqqToEth(enteredAddress));
        setValidHaqqAddress(enteredAddress);
        setInputError('');
      } else if (isValidEthAddress(enteredAddress)) {
        const haqqAddress = ethToHaqq(enteredAddress);
        setConvertedAddress(haqqAddress);
        setValidHaqqAddress(haqqAddress);
        setInputError('');
      } else {
        setConvertedAddress('');
        setValidHaqqAddress('');
        setInputError(
          t('invalid-address', 'Please enter a valid address', { ns: 'utils' }),
        );
      }
    } else {
      setInputError('');
      setValidHaqqAddress('');
      setConvertedAddress('');
    }
  }, [enteredAddress, t]);

  const handleValidateAddressDebounced = debounce(handleValidateAddress, 200);

  const handleAddressCopy = useCallback(async () => {
    if (convertedAddress) {
      await copyText(convertedAddress);
      setIsAddressCopied(true);

      const timeoutId = setTimeout(() => {
        setIsAddressCopied(false);
      }, 2500);

      return () => {
        return clearTimeout(timeoutId);
      };
    }
  }, [copyText, convertedAddress]);

  useEffect(() => {
    handleValidateAddressDebounced();
  }, [enteredAddress, handleValidateAddressDebounced]);

  return (
    <div className="flex flex-col">
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
            {t('address-conversion-title', 'Address Conversion', {
              ns: 'utils',
            })}
          </div>
        </Container>
      </div>

      <Container className="border-haqq-border bg-haqq-black/15 border-t-[1px] backdrop-blur">
        <div className="font-guise flex flex-col py-[32px] sm:py-[22px] lg:py-[32px]">
          <div className="mb-[24px] flex flex-row items-center">
            <WalletIcon />
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <Heading level={3} className="mb-[-2px] ml-[8px]">
              Bech32 / EVM
            </Heading>
          </div>

          <div className="flex flex-col items-start space-y-6 lg:flex-row lg:flex-wrap lg:justify-between lg:gap-6 lg:space-y-0">
            <LabeledBlock
              className="w-full max-w-lg lg:max-w-sm xl:max-w-lg"
              title={t('address-label', 'Address', { ns: 'common' })}
              value={
                <div className="w-full">
                  <input
                    className={clsx(
                      'inline-block w-full rounded-[6px] border border-[#252528] bg-transparent px-[16px] py-[12px] text-[14px] leading-[22px] text-white placeholder-white/25 outline-none',
                      'transition-colors duration-150 ease-in will-change-[color,background]',
                      'focus:border-white/50 focus:bg-transparent focus:text-white',
                      'hover:border-white/20',
                    )}
                    value={enteredAddress}
                    onChange={handleAddressChange}
                    type="text"
                  />

                  <div className="text-haqq-danger mt-1 text-sm lg:text-base">
                    {inputError}
                  </div>
                </div>
              }
            />
            <LabeledBlock
              className="lg:min-w-[200px] lg:justify-around"
              title={t('converted-address-label', 'Converted address', {
                ns: 'utils',
              })}
              value={
                convertedAddress ? (
                  <Tooltip
                    className="shrink-0"
                    text={
                      isAddressCopied
                        ? t('copied', 'Copied!', { ns: 'common' })
                        : `${t('click-to-copy', 'Click to copy', { ns: 'common' })} ${convertedAddress}`
                    }
                  >
                    <div
                      className="flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden text-[18px] leading-[28px] text-white transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
                      onClick={handleAddressCopy}
                    >
                      <div>
                        <span className="inline-block sm:hidden lg:inline-block">
                          {getFormattedAddress(convertedAddress, 6, 6, '...')}
                        </span>
                        <span className="hidden sm:inline-block lg:hidden">
                          {convertedAddress}
                        </span>
                      </div>

                      <CopyIcon className="mb-[-2px]" />
                    </div>
                  </Tooltip>
                ) : (
                  <div>-</div>
                )
              }
            />
            <LabeledBlock
              className="lg:min-w-[200px] lg:justify-around"
              title={t('balance-label', 'Balance', { ns: 'utils' })}
              value={
                balance !== undefined
                  ? `${formatNumber(balance)} ${symbol}`
                  : '-'
              }
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
