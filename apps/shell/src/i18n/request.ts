import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { Locale } from '../tolgee/shared';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from request and fallback to default if needed
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: { locale },
  };
});
