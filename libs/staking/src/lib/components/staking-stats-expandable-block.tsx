'use client';
import { ReactNode, useCallback, useState } from 'react';
import clsx from 'clsx';
import { ArrowDownIcon } from '@haqq/shell-ui-kit/server';

export function StakingStatsExpandableBlock({
  title,
  value,
  symbol,
  isGreen = false,
  uppercaseSymbol = true,
  content,
}: {
  title: string;
  value: string;
  symbol: string;
  isGreen?: boolean;
  uppercaseSymbol?: boolean;
  content: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex flex-row justify-between gap-y-[6px]"
        onClick={toggle}
      >
        <div className="font-guise text-[12px] font-[600] uppercase leading-[20px] text-white/50">
          {title}
        </div>

        <div className="flex flex-col items-end gap-[2px]">
          <div
            className={clsx(
              'font-guise text-[13px] font-[500] leading-[20px]',
              isGreen ? 'text-[#01B26E]' : 'text-white',
            )}
          >
            {value}&nbsp;{uppercaseSymbol ? symbol.toUpperCase() : symbol}
          </div>

          <div className="inline-flex flex-row items-end justify-center gap-[4px] text-[12px] font-[500] leading-[16px]">
            {isOpen ? <span>Less info</span> : <span>More info</span>}
            <ArrowDownIcon
              className={clsx(
                'transition-transform duration-200',
                isOpen && 'rotate-180',
              )}
            />
          </div>
        </div>
      </div>

      {isOpen && <div className="my-2">{content}</div>}
    </div>
  );
}
