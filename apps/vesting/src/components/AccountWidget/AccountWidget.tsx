import { useCallback, ReactNode, useMemo } from 'react';
import { getFormattedAddress } from '@haqq/shell-shared';
import widgetBg from '../../assets/account-widget-bg.svg';
import { useClipboard } from '../../hooks/useClipboard';
import { formatLocaleNumber } from '../../utils/format-number-locale';
import { Card } from '../Card/Card';
import { CopyIcon } from '../Icons/Icons';

function AccountWidgetBgImage() {
  return (
    <img
      src={widgetBg}
      alt=""
      className="absolute left-[80%] top-[50%] h-[272px] w-[271px] translate-x-[-50%] translate-y-[-50%] select-none"
    />
  );
}

function CardIconButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return <button onClick={onClick}>{children}</button>;
}

function CopyButton({ text }: { text: string }) {
  const { copyText } = useClipboard();
  const handleTextCopy = useCallback(() => {
    copyText(text);
  }, [copyText, text]);

  return (
    <CardIconButton onClick={handleTextCopy}>
      <CopyIcon className="cursor-pointer text-white/60 transition-colors duration-150 hover:text-white" />
    </CardIconButton>
  );
}

function AccountAddress({
  ethAddress,
  haqqAddress,
}: {
  ethAddress: string;
  haqqAddress: string;
}) {
  return (
    <div className="flex flex-row items-center space-x-2">
      <div className="flex flex-col">
        <div className="flex flex-row items-center space-x-1">
          <div className="text-base font-medium text-white">
            {getFormattedAddress(ethAddress, 6)}
          </div>
          <CopyButton text={ethAddress} />
        </div>
        <div className="flex flex-row items-center space-x-1">
          <div className="text-base font-medium text-white">
            {getFormattedAddress(haqqAddress, 6)}
          </div>
          <CopyButton text={haqqAddress} />
        </div>
      </div>
    </div>
  );
}

export function AccountWidget({
  ethAddress,
  haqqAddress,
  balance,
}: {
  ethAddress: string;
  haqqAddress: string;
  balance: number;
}) {
  return (
    <div className="relative mx-auto h-[260px] w-full max-w-lg overflow-clip rounded-[16px] bg-[#06BE77] shadow-sm transition-shadow duration-100 ease-in hover:shadow-lg hover:shadow-[#06BE77]/10">
      <div className="relative z-10 flex h-full flex-col justify-between gap-2 p-4">
        <div>
          <AccountAddress ethAddress={ethAddress} haqqAddress={haqqAddress} />
        </div>
        <div>
          <div className="text-xs leading-normal text-white/80 md:text-sm">
            Total balance
          </div>
          <div className="leading-light font-messiri text-3xl font-medium text-white md:mt-1 md:text-4xl">
            {formatLocaleNumber(balance)} ISLM
          </div>
        </div>
      </div>
      <AccountWidgetBgImage />
    </div>
  );
}

export function BalancesFromIndexer({
  available,
  locked,
  staked,
  vested,
  daoLocked,
}: {
  available: number;
  locked: number;
  staked: number;
  vested: number;
  daoLocked: number;
}) {
  const { vestedPercent, stakedPercent, daoLockedPercent } = useMemo(() => {
    const all = vested + staked + daoLocked;
    const vestedPercent = (vested / all) * 100;
    const stakedPercent = (staked / all) * 100;
    const daoLockedPercent = (daoLocked / all) * 100;

    return {
      vestedPercent,
      stakedPercent,
      daoLockedPercent,
    };
  }, [vested, staked, daoLocked]);

  return (
    <Card className="mx-auto w-full max-w-lg overflow-hidden p-4 text-[#0c0c0c]">
      <div className="flex flex-col gap-2">
        {available > 0 && (
          <div>
            <div className="text-xs leading-normal text-[#8E8E8E] md:text-sm">
              Available balance
            </div>
            <div className="leading-light font-messiri text-2xl font-medium text-[#0c0c0c] md:mt-1 md:text-3xl">
              {formatLocaleNumber(available)} ISLM
            </div>
          </div>
        )}
        {locked > 0 && (
          <div>
            <div className="text-xs leading-normal text-[#8E8E8E] md:text-sm">
              Locked balance
            </div>
            <div className="leading-light font-messiri text-2xl font-medium text-[#0c0c0c] md:mt-1 md:text-3xl">
              {formatLocaleNumber(locked)} ISLM
            </div>
          </div>
        )}
        {(vested > 0 || staked > 0 || daoLocked > 0) && (
          <div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-[2px]">
                {vested > 0 && (
                  <div
                    style={{ width: `${vestedPercent}%` }}
                    className="h-[6px] min-w-[6px] rounded-[8px] bg-[#B26F1D]"
                  />
                )}
                {staked > 0 && (
                  <div
                    style={{ width: `${stakedPercent}%` }}
                    className="h-[6px] min-w-[6px] rounded-[8px] bg-[#0489D4]"
                  />
                )}
                {daoLocked > 0 && (
                  <div
                    style={{ width: `${daoLockedPercent}%` }}
                    className="bg-islamic-green h-[6px] min-w-[6px] rounded-[8px]"
                  />
                )}
              </div>
              <div className="flex select-none flex-col justify-between pt-[4px]">
                {vested > 0 && (
                  <div className="text-[14px] font-[600] leading-[18px] text-[#B26F1D]">
                    Vested: {formatLocaleNumber(vested)} ISLM
                  </div>
                )}
                {staked > 0 && (
                  <div className="text-[14px] font-[600] leading-[18px] text-[#0489D4]">
                    Staked: {formatLocaleNumber(staked)} ISLM
                  </div>
                )}
                {daoLocked > 0 && (
                  <div className="text-islamic-green text-[14px] font-[600] leading-[18px]">
                    UnitedContributorsDAO: {formatLocaleNumber(daoLocked)} ISLM
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
