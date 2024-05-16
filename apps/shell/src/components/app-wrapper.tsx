'use client';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePostHog } from 'posthog-js/react';
import { useMediaQuery } from 'react-responsive';
import { useConnect, useNetwork } from 'wagmi';
import { haqqTestedge2 } from 'wagmi/chains';
import { useWallet, useSupportedChains, useConfig } from '@haqq/shell-shared';
import {
  Page,
  Header,
  SelectWalletModal,
  TestedgeBanner,
  Footer,
  SelectChainModal,
  LowBalanceAlert,
} from '@haqq/shell-ui-kit';
import { HeaderButtons } from '../components/header-buttons';
import { useHaqqWalletAutoConnect } from '../hooks/use-autoconnect';

declare const window: Window &
  typeof globalThis & {
    __HAQQWALLET__?: {
      POSTHOG_DISTINCT_ID?: string;
    };
  };

export function AppWrapper({ children }: PropsWithChildren) {
  const { commitSha } = useConfig();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBlurred, setBlured] = useState(false);
  const isDesktop = useMediaQuery({
    query: `(min-width: 1024px)`,
  });
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { connectAsync, connectors, error, isLoading } = useConnect();
  const {
    closeSelectWallet,
    isSelectWalletOpen,
    isSelectChainOpen,
    closeSelectChain,
    selectNetwork,
    isHaqqWallet,
    isLowBalanceAlertOpen,
    closeLowBalanceAlert,
  } = useWallet();
  const posthog = usePostHog();

  useHaqqWalletAutoConnect();

  const handleWalletConnect = useCallback(
    async (connectorIdx: number) => {
      await connectAsync({ connector: connectors[connectorIdx] });
      closeSelectWallet();
    },
    [closeSelectWallet, connectAsync, connectors],
  );

  const handleChainSelect = useCallback(
    async (chainId: number) => {
      await selectNetwork(chainId);
      closeSelectChain();
    },
    [closeSelectChain, selectNetwork],
  );

  useEffect(() => {
    function handleScroll() {
      const offset = 30;
      if (window.scrollY > offset) {
        setBlured(true);
      } else {
        setBlured(false);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDesktop]);

  const isTestedge = useMemo(() => {
    return chain.id === haqqTestedge2.id;
  }, [chain.id]);

  const selectWalletModalConnectors = useMemo(() => {
    return connectors.map((connector, index) => {
      return {
        id: index,
        name: connector.name,
        isPending: isLoading,
      };
    });
  }, [connectors, isLoading]);

  useEffect(() => {
    if (isHaqqWallet) {
      const walletDistinctId = window.__HAQQWALLET__?.POSTHOG_DISTINCT_ID;
      posthog.identify(walletDistinctId ?? posthog.get_distinct_id());
    }
  }, [posthog, isHaqqWallet]);

  return (
    <Page
      header={
        <Header
          darkBackground={isMobileMenuOpen}
          isBlurred={isBlurred}
          isHaqqWallet={isHaqqWallet}
          rightSlot={
            <HeaderButtons
              isMobileMenuOpen={isMobileMenuOpen}
              onMobileMenuOpenChange={setMobileMenuOpen}
              isTestedge={isTestedge}
            />
          }
        />
      }
      banner={isTestedge && <TestedgeBanner />}
      footer={<Footer commitSha={commitSha} />}
    >
      {children}

      <SelectWalletModal
        isOpen={isSelectWalletOpen}
        connectors={selectWalletModalConnectors}
        error={error?.message}
        onConnectClick={handleWalletConnect}
        onClose={closeSelectWallet}
      />
      <SelectChainModal
        isOpen={isSelectChainOpen}
        chains={chains}
        onChainSelect={handleChainSelect}
        onClose={closeSelectChain}
      />
      <LowBalanceAlert
        isOpen={isLowBalanceAlertOpen}
        onClose={closeLowBalanceAlert}
      />
    </Page>
  );
}
