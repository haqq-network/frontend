'use client';
import { PropsWithChildren, useCallback, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import {
  getFormattedAddress,
  useAddress,
  useClipboard,
  useIndexerBalanceQuery,
} from '@haqq/shell-shared';
import { Tooltip } from '@haqq/shell-ui-kit';
import { CopyIcon, formatNumber } from '@haqq/shell-ui-kit/server';

export function MyAccountCardBlock({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <div className="flex flex-1 flex-col items-start gap-y-[6px]">
      {title ? (
        <div className="text-[10px] font-[500] uppercase leading-[12px] text-white/50 lg:text-[12px] lg:leading-[14px]">
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
  const { data: balance } = useIndexerBalanceQuery(haqqAddress);
  const [isEthAddressCopy, setEthAddressCopy] = useState(false);
  const [isHaqqAddressCopy, setHaqqAddressCopy] = useState(false);

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
          <MyAccountCardBlock
            title={t('address-label', 'Address', { ns: 'common' })}
          >
            <div className="font-guise flex flex-col gap-[16px] sm:flex-row">
              <div className="flex-1">
                <Tooltip
                  text={
                    isEthAddressCopy
                      ? t('copied', 'Copied!', { ns: 'faucet' })
                      : t('click-to-copy-value', 'Click to copy {value}', {
                          ns: 'faucet',
                          value: ethAddress,
                        })
                  }
                >
                  <div
                    className="font-guise inline-flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden text-[18px] font-[500] leading-[28px] text-white transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
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
                      ? t('copied', 'Copied!', { ns: 'faucet' })
                      : t('click-to-copy-value', 'Click to copy {value}', {
                          ns: 'faucet',
                          value: haqqAddress,
                        })
                  }
                >
                  <div
                    className="font-guise inline-flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden text-[18px] font-[500] leading-[28px] text-white transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
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

      {balance?.balance !== undefined && (
        <MyAccountCardBlock title={t('balance', 'Balance', { ns: 'faucet' })}>
          <div className="font-clash flex flex-1 flex-row items-center text-[20px] font-[500] leading-[30px]">
            {formatNumber(balance.balance)}&nbsp;ISLM
          </div>
        </MyAccountCardBlock>
      )}
    </div>
  );
}
