'use client';
import dynamic from 'next/dynamic';
import { useMediaQuery } from 'usehooks-ts';

const AppHeaderMobile = dynamic(async () => {
  const { AppHeaderMobile } = await import('./header-mobile');
  return { default: AppHeaderMobile };
});
const AppHeaderDesktop = dynamic(async () => {
  const { AppHeaderDesktop } = await import('./header-desktop');
  return { default: AppHeaderDesktop };
});

export function AppHeader() {
  const isDesktop = useMediaQuery('(min-width: 1024px)', {
    defaultValue: true,
    initializeWithValue: false,
  });

  return isDesktop ? (
    <AppHeaderDesktop className="hidden lg:block" />
  ) : (
    <AppHeaderMobile className="block lg:hidden" />
  );
}
