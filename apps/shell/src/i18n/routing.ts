import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '../tolgee/shared';

export const routing = defineRouting({
  locales: AVAILABLE_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localeCookie: {
    // Custom cookie name
    name: 'USER_LOCALE',
    // Expire in one day
    maxAge: 60 * 60 * 24,
  },
});

export const { Link, redirect, usePathname, useRouter, permanentRedirect } =
  createNavigation(routing);
