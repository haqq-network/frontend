'use client';
import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '../i18n/routing';
import { AVAILABLE_LOCALES, LOCALE_LABELS } from '../tolgee/shared';

export function useLocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchLocale = useCallback(
    (locale: string) => {
      router.replace(pathname, { locale });
    },
    [router, pathname],
  );

  const locales = AVAILABLE_LOCALES.map((locale) => {
    return {
      id: locale,
      label: LOCALE_LABELS[locale].label,
      emoji: LOCALE_LABELS[locale].emoji,
    };
  });

  return {
    switchLocale,
    locales,
    currentLocale,
  };
}
