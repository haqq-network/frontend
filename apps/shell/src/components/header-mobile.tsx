'use client';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useAccount, useChains } from 'wagmi';
import { haqqTestedge2 } from 'wagmi/chains';
import { HeaderMobile } from '@haqq/shell-ui-kit';
import { headerLinks } from '../config/header-links';

const Web3ConnectButtonsMobile = dynamic(async () => {
  const { Web3ConnectButtonsMobile } = await import(
    '../components/web3-connect-button'
  );
  return { default: Web3ConnectButtonsMobile };
});

const HeaderUtilsMenu = dynamic(async () => {
  const { HeaderUtilsMenu } = await import('../components/header-utils-menu');
  return { default: HeaderUtilsMenu };
});

export function AppHeaderMobile({ className }: { className?: string }) {
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const isTestedge = chain.id === haqqTestedge2.id;

  const links = useMemo(() => {
    return headerLinks.filter((link) => {
      return link.chains.includes(chain.id);
    });
  }, [chain.id]);

  return (
    <HeaderMobile
      links={links}
      web3ButtonsSlot={<Web3ConnectButtonsMobile />}
      utilsSlot={<HeaderUtilsMenu />}
      className={className}
      isTestedge={isTestedge}
    />
  );
}
