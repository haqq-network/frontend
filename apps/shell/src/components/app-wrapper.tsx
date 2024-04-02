'use client';
import {
  Fragment,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useMediaQuery } from 'react-responsive';
import ScrollLock from 'react-scrolllock';
import { useBalance, useConnect, useSwitchNetwork, useNetwork } from 'wagmi';
import { haqqTestedge2 } from 'wagmi/chains';
import {
  useAddress,
  useWallet,
  getFormattedAddress,
  useSupportedChains,
  useConfig,
} from '@haqq/shell-shared';
import {
  Page,
  Header,
  AccountButton,
  HeaderNavLink,
  Button,
  BurgerButton,
  SelectChainButton,
  SelectWalletModal,
  TestedgeBanner,
  formatNumber,
  Footer,
  CommitSha,
  SelectChainModal,
  LowBalanceAlert,
} from '@haqq/shell-ui-kit';
import { useHaqqWalletAutoConnect } from '../hooks/use-autoconnect';

declare const window: Window &
  typeof globalThis & {
    __HAQQWALLET__?: {
      POSTHOG_DISTINCT_ID?: string;
    };
  };

function HeaderButtons({
  isMobileMenuOpen,
  onMobileMenuOpenChange,
  isTestedge,
}: {
  isMobileMenuOpen: boolean;
  onMobileMenuOpenChange: (isMobileMenuOpen: boolean) => void;
  isTestedge: boolean;
}) {
  const { commitSha } = useConfig();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { disconnect, openSelectWallet, isNetworkSupported, selectNetwork } =
    useWallet();
  const { ethAddress } = useAddress();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    chainId: chain.id,
  });
  const { switchNetworkAsync } = useSwitchNetwork();
  const isDesktop = useMediaQuery({
    query: `(min-width: 1024px)`,
  });
  const router = useRouter();
  const { isHaqqWallet } = useWallet();

  const handleChainSelectClick = useCallback(
    async (chainId: number) => {
      if (switchNetworkAsync) {
        await switchNetworkAsync(chainId);
        router.push('/');
      }
    },
    [router, switchNetworkAsync],
  );

  const balance = useMemo(() => {
    if (!balanceData) {
      return undefined;
    }

    return {
      symbol: balanceData.symbol,
      value: formatNumber(Number.parseFloat(balanceData.formatted)),
    };
  }, [balanceData]);

  const selectChainButtonProps = useMemo(() => {
    return {
      isSupported: isNetworkSupported,
      currentChain: {
        name: chain.name.replace('HAQQ', '').trim() ?? '',
        id: chain.id ?? 0,
      },
      chains: chains.map((chain) => {
        return {
          name: chain.name.replace('HAQQ', '').trim(),
          id: chain.id,
        };
      }),
    };
  }, [chain.id, chain.name, chains, isNetworkSupported]);

  useEffect(() => {
    if (isDesktop) {
      onMobileMenuOpenChange(false);
    }
  }, [isDesktop, onMobileMenuOpenChange]);

  return (
    <Fragment>
      <nav className="hidden flex-row items-center space-x-6 lg:flex">
        <HeaderNavLink href="/staking">Staking</HeaderNavLink>
        <HeaderNavLink href="/governance">Governance</HeaderNavLink>
        <HeaderNavLink href="/authz">Authz</HeaderNavLink>
        {isTestedge && <HeaderNavLink href="/faucet">Faucet</HeaderNavLink>}
      </nav>

      <div className="hidden pl-[80px] lg:block">
        {ethAddress ? (
          <div className="flex flex-row gap-[24px]">
            <SelectChainButton
              {...selectChainButtonProps}
              onChainSelect={async (chainId) => {
                await selectNetwork(chainId);
                router.push('/');
              }}
            />
            <AccountButton
              balance={balance}
              address={getFormattedAddress(ethAddress, 3, 2)}
              onDisconnectClick={disconnect}
            />
          </div>
        ) : (
          <Button onClick={openSelectWallet}>Connect wallet</Button>
        )}
      </div>

      <div className="block leading-[0] lg:hidden">
        <BurgerButton
          isOpen={isMobileMenuOpen}
          onClick={() => {
            onMobileMenuOpenChange(!isMobileMenuOpen);
          }}
          className="h-[24px] w-[24px] sm:h-[30px] sm:w-[30px]"
        />
      </div>

      {isMobileMenuOpen && (
        <Fragment>
          <ScrollLock isActive />

          <div
            className={clsx(
              'bg-haqq-black fixed right-0 z-40 w-full transform-gpu lg:hidden',
              isTestedge
                ? 'top-[61px] h-[calc(100vh-101px)] sm:top-[71px] sm:h-[calc(100vh-111px)]'
                : 'top-[61px] h-[calc(100vh-61px)] sm:top-[71px] sm:h-[calc(100vh-71px)]',
            )}
          >
            <div className="overflow-y-auto px-[24px] py-[32px]">
              <div className="mb-[24px] flex flex-col items-start gap-[16px] sm:mb-[80px]">
                {isHaqqWallet && (
                  <div>
                    <HeaderNavLink
                      href="/"
                      onClick={() => {
                        onMobileMenuOpenChange(false);
                      }}
                    >
                      Home
                    </HeaderNavLink>
                  </div>
                )}

                <div>
                  <HeaderNavLink
                    href="/staking"
                    onClick={() => {
                      onMobileMenuOpenChange(false);
                    }}
                  >
                    Staking
                  </HeaderNavLink>
                </div>
                <div>
                  <HeaderNavLink
                    href="/governance"
                    onClick={() => {
                      onMobileMenuOpenChange(false);
                    }}
                  >
                    Governance
                  </HeaderNavLink>
                </div>
                <div>
                  <HeaderNavLink
                    href="/authz"
                    onClick={() => {
                      onMobileMenuOpenChange(false);
                    }}
                  >
                    Authz
                  </HeaderNavLink>
                </div>
                {isTestedge && (
                  <div>
                    <HeaderNavLink
                      href="/faucet"
                      onClick={() => {
                        onMobileMenuOpenChange(false);
                      }}
                    >
                      Faucet
                    </HeaderNavLink>
                  </div>
                )}
              </div>

              {ethAddress && (
                <div className="flex flex-col gap-[24px]">
                  <div>
                    <SelectChainButton
                      {...selectChainButtonProps}
                      onChainSelect={handleChainSelectClick}
                    />
                  </div>
                  <AccountButton
                    balance={balance}
                    address={getFormattedAddress(ethAddress, 3, 2)}
                    onDisconnectClick={disconnect}
                    withoutDropdown
                  />
                </div>
              )}

              <div className="mt-[24px]">
                {ethAddress ? (
                  <Button onClick={disconnect}>Disconnect</Button>
                ) : (
                  <Button onClick={openSelectWallet}>Connect wallet</Button>
                )}
              </div>
            </div>

            <div className="absolute bottom-[8px] left-[20px]">
              <div className="text-[12px] leading-[16px] text-white/20">
                <CommitSha
                  commitSha={commitSha}
                  className="transition-colors duration-150 hover:text-white/80"
                />
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

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
