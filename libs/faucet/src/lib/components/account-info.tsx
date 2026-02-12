'use client';
import { PropsWithChildren, useCallback, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { Hex } from 'viem';
import { useBalance } from 'wagmi';
import {
  formatEthDecimal,
  getFormattedAddress,
  useAddress,
  useClipboard,
} from '@haqq/shell-shared';
import { Tooltip } from '@haqq/shell-ui-kit';
import { CopyIcon } from '@haqq/shell-ui-kit/server';

export function MyAccountCardBlock({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <div className="flex flex-1 flex-col items-start gap-y-[6px]">
      {title ? (
        <div className="text-[10px] font-medium uppercase leading-[12px] text-white/50 lg:text-[12px] lg:leading-[14px]">
          {title}
        </div>
      ) : null}
      <div>{children}</div>
    </div>
  );
}

export function AccountInfo() {
  const { t } = useTranslate();
  const { ethAddress, haqqAddress } = useAddress();
  const { copyText } = useClipboard();
  const balancesData = useBalance({ address: ethAddress as Hex });
  const [isEthAddressCopy, setEthAddressCopy] = useState(false);
  const [isHaqqAddressCopy, setHaqqAddressCopy] = useState(false);

  const balance = balancesData.data?.value;

  const handleEthAddressCopy = useCallback(async () => {
    if (ethAddress) {
      await copyText(ethAddress);
      setEthAddressCopy(true);

      setTimeout(() => {
        setEthAddressCopy(false);
      }, 2500);
    }
  }, [copyText, ethAddress]);

  const handleHaqqAddressCopy = useCallback(async () => {
    if (haqqAddress) {
      await copyText(haqqAddress);
      setHaqqAddressCopy(true);

      setTimeout(() => {
        setHaqqAddressCopy(false);
      }, 2500);
    }
  }, [copyText, haqqAddress]);

  return (
    <div className="flex flex-col justify-between gap-[16px]">
      {ethAddress && (
        <div className="flex flex-1 flex-row items-center gap-x-4">
          <MyAccountCardBlock title={t('address', 'Address', { ns: 'common' })}>
            <div className="font-guise flex flex-col gap-[16px] sm:flex-row">
              <div className="flex-1">
                <Tooltip
                  text={
                    isEthAddressCopy
                      ? t('copied', 'Copied!', { ns: 'common' })
                      : t('click-to-copy-value', 'Click to copy {value}', {
                          ns: 'common',
                          value: ethAddress,
                        })
                  }
                >
                  <div
                    className="font-guise inline-flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden text-[18px] font-medium leading-[28px] text-white transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
                    onClick={handleEthAddressCopy}
                  >
                    <div>{getFormattedAddress(ethAddress, 6, 6, '...')}</div>
                    <CopyIcon className="mb-[-2px]" />
                  </div>
                </Tooltip>
              </div>
              <div className="flex-1">
                <Tooltip
                  text={
                    isHaqqAddressCopy
                      ? t('copied', 'Copied!', { ns: 'common' })
                      : t('click-to-copy-value', 'Click to copy {value}', {
                          ns: 'common',
                          value: haqqAddress,
                        })
                  }
                >
                  <div
                    className="font-guise inline-flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden text-[18px] font-medium leading-[28px] text-white transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
                    onClick={handleHaqqAddressCopy}
                  >
                    <div>{getFormattedAddress(haqqAddress, 6, 6, '...')}</div>
                    <CopyIcon className="mb-[-2px]" />
                  </div>
                </Tooltip>
              </div>
            </div>
          </MyAccountCardBlock>
        </div>
      )}

      {balance !== undefined && (
        <MyAccountCardBlock title={t('balance', 'Balance', { ns: 'common' })}>
          <div className="font-clash flex flex-1 flex-row items-center text-[20px] font-medium leading-[30px]">
            {formatEthDecimal(balance, 2, balancesData.data?.decimals ?? 18)}
            &nbsp; {balancesData.data?.symbol}
          </div>
        </MyAccountCardBlock>
      )}
    </div>
  );
}
