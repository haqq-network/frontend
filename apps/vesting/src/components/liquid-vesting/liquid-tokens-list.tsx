import { useState } from 'react';
import { formatUnits } from 'viem';
import { LiquidToken } from '../../hooks/use-liquid-tokens';
import { formatLocaleNumber } from '../../utils/format-number-locale';
import { Button } from '../Button/Button';

export function AddedToken({
  token,
  onTokenAddClick,
}: {
  token: LiquidToken;
  onTokenAddClick: (denom: string) => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between py-[6px]">
      <div className="text-[16px] leading-[24px] font-semibold">
        {token.amount} {token.denom.toUpperCase()}
      </div>
      <div>
        <Button
          outline
          onClick={() => {
            onTokenAddClick(token.denom);
          }}
        >
          Add token
        </Button>
      </div>
    </div>
  );
}

export function LiquidTokensList({
  liquidTokens = [],
  onTokenAddClick,
  onTokenRedeemClick,
}: {
  liquidTokens?: LiquidToken[];
  onTokenAddClick: (denom: string) => void;
  onTokenRedeemClick: (denom: string) => void;
}) {
  const [isOpen, setOpen] = useState(false);

  if (liquidTokens.length < 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[6px] rounded-[12px] bg-[#F4F4F480] px-[16px] py-[8px]">
      <div className="flex flex-row items-center justify-between">
        <div>
          <div className="font-messiri mb-[-4px] text-[18px] leading-[30px] font-semibold">
            Your tokens
          </div>
        </div>

        <div
          className="text-islamic-green cursor-pointer text-[14px] leading-[30px] select-none"
          onClick={() => {
            setOpen(!isOpen);
          }}
        >
          {isOpen ? 'Hide all tokens' : 'Show all tokens'}
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col divide-y divide-[#D9D9D9]/50">
          {liquidTokens.map((token, index) => {
            return (
              <div
                key={`${index}-${token.denom}`}
                className="flex flex-row items-center justify-between py-[6px]"
              >
                <div className="text-[16px] leading-[30px] font-semibold">
                  {formatLocaleNumber(
                    Number.parseInt(formatUnits(BigInt(token.amount), 18)),
                  )}{' '}
                  {token.denom}
                </div>

                <div className="flex flex-row gap-4">
                  <div
                    className="hover:text-opacity-80 block cursor-pointer text-[14px] leading-[30px] text-[#0389D4]"
                    onClick={() => {
                      onTokenAddClick(token.denom);
                    }}
                  >
                    Add to wallet
                  </div>
                  <div
                    className="hover:text-opacity-80 block cursor-pointer text-[14px] leading-[30px] text-[#0389D4]"
                    onClick={() => {
                      onTokenRedeemClick(token.denom);
                    }}
                  >
                    Redeem
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
