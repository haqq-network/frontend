'use client';
import { useContext } from 'react';
import dynamic from 'next/dynamic';
import { useMediaQuery } from 'usehooks-ts';
import { UserAgentContext } from '@haqq/shell-shared';

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

  const { isMobileUA } = useContext(UserAgentContext);

  if (isMobileUA) {
    return <AppHeaderMobile className="block lg:hidden" />;
  }

  return isDesktop ? (
    <AppHeaderDesktop className="hidden lg:block" />
  ) : (
    <AppHeaderMobile className="block lg:hidden" />
  );
}
