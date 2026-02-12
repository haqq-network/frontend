import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';

export function ValidatorListStatus({
  jailed,
  status,
  className,
}: {
  jailed: boolean;
  status: number;
  className?: string;
}) {
  const { t } = useTranslate('common');
  if (jailed) {
    return (
      <div
        className={clsx('text-[16px] leading-[26px] text-[#FF5454]', className)}
      >
        {t('jailed-status', 'Jailed')}
      </div>
    );
  }

  if (status === 3) {
    return (
      <div
        className={clsx('text-[16px] leading-[26px] text-[#01B26E]', className)}
      >
        {t('active-status', 'Active')}
      </div>
    );
  }

  return (
    <div
      className={clsx('text-[16px] leading-[26px] text-[#E3A13F]', className)}
    >
      {t('inactive-status', 'Inactive')}
    </div>
  );
}

export function ValidatorDetailsStatus({
  jailed,
  status,
}: {
  jailed: boolean;
  status: string;
}) {
  const { t } = useTranslate('common');
  if (jailed) {
    return (
      <div
        className={clsx(
          'inline-block rounded-lg px-[12px] pt-[13px] pb-[11px] text-center whitespace-nowrap',
          'font-clash text-[14px] leading-none font-medium tracking-[.01em] text-white uppercase',
          'bg-[#FF5454]',
        )}
      >
        {t('jailed-status', 'Jailed')}
      </div>
    );
  }

  if (status === 'BOND_STATUS_BONDED') {
    return (
      <div
        className={clsx(
          'inline-block rounded-lg px-[12px] pt-[13px] pb-[11px] text-center whitespace-nowrap',
          'font-clash text-[14px] leading-none font-medium tracking-[.01em] text-white uppercase',
          'bg-[#01B26E]',
        )}
      >
        {t('active-status', 'Active')}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'inline-block rounded-lg px-[12px] pt-[13px] pb-[11px] text-center whitespace-nowrap',
        'font-clash text-[14px] leading-none font-medium tracking-[.01em] text-white uppercase',
        'bg-[#E3A13F]',
      )}
    >
      {t('inactive-status', 'Inactive')}
    </div>
  );
}
