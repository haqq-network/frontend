import createMiddleware from 'next-intl/middleware';
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from './tolgee/shared';

export default createMiddleware({
  locales: AVAILABLE_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'never',
});

export const config = {
  // Skip the paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
