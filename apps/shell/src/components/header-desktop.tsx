'use client';
import dynamic from 'next/dynamic';
import { useAccount, useChains } from 'wagmi';
import { FAUCET_CHAINS } from '@haqq/shell-shared';
import { Header } from '@haqq/shell-ui-kit';
import { useFilteredLinks } from '../hooks/use-filtered-header-links';
import { useLocaleSwitcher } from '../hooks/use-locale-switcher';

const Web3ConnectButtons = dynamic(async () => {
  const { Web3ConnectButtons } = await import(
    '../components/web3-connect-button'
  );
  return { default: Web3ConnectButtons };
});

export function AppHeaderDesktop({ className }: { className?: string }) {
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const isTestedge = FAUCET_CHAINS.includes(chain.id);
  const links = useFilteredLinks(chain);
  const { switchLocale, locales, currentLocale } = useLocaleSwitcher();

  return (
    <Header
      links={links}
      web3ButtonsSlot={<Web3ConnectButtons />}
      className={className}
      isTestedge={isTestedge}
      locales={locales}
      switchLocale={switchLocale}
      currentLocale={currentLocale}
    />
  );
}
