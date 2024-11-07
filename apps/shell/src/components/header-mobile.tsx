'use client';
import dynamic from 'next/dynamic';
import { useAccount, useChains } from 'wagmi';
import { haqqTestedge2 } from 'wagmi/chains';
import { HeaderMobile } from '@haqq/shell-ui-kit';
import { useFilteredLinks } from '../hooks/use-filtered-header-links';

const Web3ConnectButtonsMobile = dynamic(async () => {
  const { Web3ConnectButtonsMobile } = await import(
    '../components/web3-connect-button'
  );
  return { default: Web3ConnectButtonsMobile };
});

export function AppHeaderMobile({ className }: { className?: string }) {
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const isTestedge = chain.id === haqqTestedge2.id;
  const links = useFilteredLinks(chain);

  return (
    <HeaderMobile
      links={links}
      web3ButtonsSlot={<Web3ConnectButtonsMobile />}
      className={className}
      isTestedge={isTestedge}
    />
  );
}
