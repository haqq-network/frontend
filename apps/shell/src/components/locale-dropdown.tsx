import { useLocaleSwitcher } from '../hooks/use-locale-switcher';
import { LocaleDropdown } from '@haqq/shell-ui-kit';

export function AppLocaleDropdown() {
  const { switchLocale, locales, currentLocale } = useLocaleSwitcher();

  return (
    <LocaleDropdown
      locales={locales}
      switchLocale={switchLocale}
      currentLocale={currentLocale}
    />
  );
}
