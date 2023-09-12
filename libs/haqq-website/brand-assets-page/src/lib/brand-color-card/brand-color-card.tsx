'use client';
import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { Button } from '@haqq/haqq-website-ui-kit';
import { BrandColorAsset } from '../../utils/brand-assets';

export function BrandColorCard({ color, colorType, hex }: BrandColorAsset) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(hex);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [hex]);

  return (
    <div className="flex flex-col gap-y-[16px]">
      <div
        className={clsx(
          'rounded-xl py-[60px] text-center text-[14px] font-semibold leading-[22px]',
          color === 'haqq-orange' && 'bg-haqq-orange',
          color === 'haqq-blue' && `bg-[#091D53]`,
          color === 'haqq-seaweed' && 'bg-[#157C83]',
          color === 'haqq-big-foot-feet' && 'bg-[#E98C50]',
          color === 'haqq-azure' && 'bg-[#ECFEFE]',
          color === 'islamic-primary' && 'bg-[#04D484]',
          color === 'haqq-azure' ? 'text-haqq-black' : 'text-white',
        )}
      >
        <div>{hex}</div>
      </div>
      <div className="flex items-center justify-between text-[12px] leading-[1.5em] text-white/50">
        {colorType === 'gradient' && 'Gradient color'}
        {colorType === 'main' && 'Main color'}
        <Button onClick={handleCopyClick}>
          {isCopied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}
