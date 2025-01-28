'use client';
import { useTranslate } from '@tolgee/react';
import Link from 'next/link';
import { BackButton } from '@haqq/shell-ui-kit/server';

export function BackToStaking() {
  const { t } = useTranslate();

  return (
    <div className="py-[18px] sm:py-[26px] lg:py-[34px]">
      <Link href="/staking">
        <BackButton>{t('staking', 'Staking', { ns: 'common' })}</BackButton>
      </Link>
    </div>
  );
}
