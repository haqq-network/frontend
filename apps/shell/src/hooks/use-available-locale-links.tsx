import { AVAILABLE_LOCALES, LOCALE_LABELS } from '../tolgee/shared';

export function useAvailableLocaleLinks() {
  return AVAILABLE_LOCALES.map((locale) => {
    return {
      id: locale,
      label: `${LOCALE_LABELS[locale].emoji} ${LOCALE_LABELS[locale].label}`,
    };
  });
}
