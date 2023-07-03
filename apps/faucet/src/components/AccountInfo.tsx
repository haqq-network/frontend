import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import {
  formatNumber,
  getFormattedAddress,
  useAddress,
  useClipboard,
} from '@haqq/shared';
import { useBalance, useNetwork } from 'wagmi';
import { CopyIcon, Tooltip } from '@haqq/shell-ui-kit';

export function MyAccountCardBlock({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <div className="flex flex-1 flex-col items-start gap-y-[6px]">
      {title && (
        <div className="text-[10px] font-[500] uppercase leading-[12px] text-white/50 lg:text-[12px] lg:leading-[14px]">
          {title}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export function AccountInfo() {
  const { chain } = useNetwork();
  const { ethAddress, haqqAddress } = useAddress();
  const { copyText } = useClipboard();
  const { data: balance } = useBalance({
    address: ethAddress,
    watch: true,
  });
  const [isEthAddressCopy, setEthAddressCopy] = useState(false);
  const [isHaqqAddressCopy, setHaqqAddressCopy] = useState(false);

  const accBalance = useMemo(() => {
    if (!balance) {
      return undefined;
    }

    return Number.parseFloat(balance.formatted);
  }, [balance]);

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
          {/* <div className="h-[40px] w-[40px] leading-[0]">
            <IdentIcon address={ethAddress} size={40} />
          </div> */}

          <MyAccountCardBlock title="Address">
            <div className="flex flex-col gap-[16px] font-sans sm:flex-row">
              <div className="flex-1">
                <Tooltip
                  text={
                    isEthAddressCopy ? 'Copied!' : `Click to copy ${ethAddress}`
                  }
                >
                  <div
                    className="flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden font-sans text-[18px] font-[500] leading-[28px] text-white transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
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
                      ? 'Copied!'
                      : `Click to copy ${haqqAddress}`
                  }
                >
                  <div
                    className="flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden font-sans text-[18px] font-[500] leading-[28px] text-white transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
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

      {accBalance !== undefined && (
        <MyAccountCardBlock title="Balance">
          <div className="flex flex-1 flex-row items-center font-serif text-[20px] font-[500] leading-[30px]">
            {formatNumber(accBalance)}{' '}
            {chain?.nativeCurrency.symbol.toLocaleUpperCase()}
          </div>
        </MyAccountCardBlock>
      )}
    </div>
  );
}
