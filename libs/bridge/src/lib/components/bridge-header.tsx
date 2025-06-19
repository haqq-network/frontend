'use client';
import { useTranslate } from '@tolgee/react';

export function BridgeHeader() {
  const { t } = useTranslate('common');

  return (
    <div className="mb-[24px]">
      <h1 className="text-[32px] font-[600] leading-[40px] text-[#0D0D0E]">
        {t('bridge-eth', 'Bridge ETH')}
      </h1>
      <p className="mt-[8px] text-[16px] text-[#0D0D0E80]">
        Transfer ETH using the Standard Bridge
      </p>
    </div>
  );
}
