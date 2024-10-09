'use client';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useAccount, useChains } from 'wagmi';
import { haqqTestedge2 } from 'wagmi/chains';
import { Header } from '@haqq/shell-ui-kit';
import { headerLinks } from '../config/header-links';

const Web3ConnectButtons = dynamic(async () => {
  const { Web3ConnectButtons } = await import(
    '../components/web3-connect-button'
  );
  return { default: Web3ConnectButtons };
});

const HeaderUtilsMenu = dynamic(async () => {
  const { HeaderUtilsMenu } = await import('../components/header-utils-menu');
  return { default: HeaderUtilsMenu };
});

export function AppHeaderDesktop({ className }: { className?: string }) {
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const isTestedge = chain.id === haqqTestedge2.id;

  const links = useMemo(() => {
    return headerLinks.filter((link) => {
      return link.chains.includes(chain.id);
    });
  }, [chain.id]);

  return (
    <Header
      links={links}
      web3ButtonsSlot={<Web3ConnectButtons />}
      utilsSlot={<HeaderUtilsMenu />}
      className={className}
      isTestedge={isTestedge}
    />
  );
}
