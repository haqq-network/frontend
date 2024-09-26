'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
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
import { CopyIcon, formatNumber } from '@haqq/shell-ui-kit/server';

const symbol = 'ISLM';

export function AddressConversionPage() {
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
        setInputError('Please enter a valid address');
      }
    } else {
      setInputError('');
      setValidHaqqAddress('');
      setConvertedAddress('');
    }
  }, [enteredAddress]);

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
    <div className="flex gap-10">
      <div>
        Balance:{' '}
        {balance !== undefined ? `${formatNumber(balance)} ${symbol}` : '-'}
      </div>
      <div>
        <input
          className="w-[450px] bg-blue-800"
          value={enteredAddress}
          onChange={handleAddressChange}
          type="text"
        />
        <div>{inputError}</div>
      </div>
      {convertedAddress && (
        <Tooltip
          className="shrink-0"
          text={
            isAddressCopied ? 'Copied!' : `Click to copy ${convertedAddress}`
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
      )}
    </div>
  );
}
