import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { ALL_LOCALES } from './tolgee/shared';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales: ALL_LOCALES });
