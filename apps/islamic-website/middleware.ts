import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { SUPPORTED_LOCALES, BLOCKED_COUNTRY } from './constants';

export const config = {
  // Next line skips folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|assets|.*\\..*).*)'],
};

const intlMiddleware = createMiddleware({
  locales: SUPPORTED_LOCALES,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
});

export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'US';
  const isCountryBlocked = country === BLOCKED_COUNTRY;

  if (isCountryBlocked) {
    request.headers.set('x-restricted-by-geo', 'true');

    if (request.nextUrl.pathname === '/markets') {
      const url = request.nextUrl.clone();
      url.pathname = '/';

      return NextResponse.rewrite(url, intlMiddleware(request));
    }
  }

  return intlMiddleware(request);
}
