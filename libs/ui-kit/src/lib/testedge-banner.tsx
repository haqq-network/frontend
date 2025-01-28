import { useTranslate } from '@tolgee/react';

export function TestedgeBanner() {
  const { t } = useTranslate('common');
  return (
    <div className="bg-haqq-orange/80 font-clash z-[51] mb-[-1px] w-full transform-gpu select-none p-[8px] text-center text-[18px] leading-[24px] text-white backdrop-blur">
      {t('testnet-banner', 'You are on test network')}
    </div>
  );
}
