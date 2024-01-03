import createMiddleware from 'next-intl/middleware';
import { SUPPORTED_LOCALES } from './constants';

export default createMiddleware({
  locales: SUPPORTED_LOCALES,
  defaultLocale: SUPPORTED_LOCALES[0],
  localePrefix: 'as-needed',
  localeDetection: true,
});

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|assets|.*\\..*).*)'],
};
