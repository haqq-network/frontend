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
  const isMobile = useMediaQuery('(max-width: 1023px)', {
    defaultValue: false,
    initializeWithValue: false,
  });

  return isMobile ? (
    <AppHeaderMobile className="block lg:hidden" />
  ) : (
    <AppHeaderDesktop className="hidden lg:block" />
  );
}
