import {
  Fragment,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
} from '@haqq/shell-ui-kit';
import ScrollLock from 'react-scrolllock';
import { useMediaQuery } from 'react-responsive';
import { useBalance, useConnect, useNetwork, useSwitchNetwork } from 'wagmi';
import {
  useAddress,
  useWallet,
  getFormattedAddress,
  useSupportedChains,
} from '@haqq/shared';
import { haqqTestedge2 } from '@wagmi/chains';
import { useNavigate } from 'react-router-dom';

function HeaderButtons({
  isMobileMenuOpen,
  onMobileMenuOpenChange,
}: {
  isMobileMenuOpen: boolean;
  onMobileMenuOpenChange: (isMobileMenuOpen: boolean) => void;
}) {
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const { disconnect, openSelectWallet } = useWallet();
  const { ethAddress } = useAddress();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    watch: true,
    chainId: chain?.id ?? chains[0]?.id,
  });
  const { switchNetworkAsync } = useSwitchNetwork();
  const isDesktop = useMediaQuery({
    query: `(min-width: 1024px)`,
  });
  const navigate = useNavigate();

  const handleChainSelectClick = useCallback(
    async (chainId: number) => {
      if (switchNetworkAsync) {
        await switchNetworkAsync(chainId);
        navigate('/');
      }
    },
    [navigate, switchNetworkAsync],
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
      isSupported: Boolean(
        chain && chain?.unsupported !== undefined && !chain.unsupported,
      ),
      currentChain: {
        name: chain?.name.replace('HAQQ', '').trim() ?? '',
        id: chain?.id ?? 0,
      },
      chains: chains.map((chain) => {
        return {
          name: chain.name.replace('HAQQ', '').trim(),
          id: chain.id,
        };
      }),
    };
  }, [chain, chains]);

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
      </nav>

      <div className="hidden pl-[80px] lg:block">
        {ethAddress ? (
          <div className="flex flex-row gap-[24px]">
            <SelectChainButton
              {...selectChainButtonProps}
              onChainSelect={handleChainSelectClick}
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

          <div className="bg-haqq-black fixed right-0 top-[61px] z-40 h-[calc(100vh-61px)] w-full transform-gpu sm:top-[71px] sm:h-[calc(100vh-71px)] lg:hidden">
            <div className="overflow-y-auto px-[24px] py-[32px]">
              <div className="mb-[24px] flex flex-col items-start space-y-[16px] sm:mb-[80px]">
                <HeaderNavLink
                  href="/staking"
                  onClick={() => {
                    onMobileMenuOpenChange(false);
                  }}
                >
                  Staking
                </HeaderNavLink>
                <HeaderNavLink
                  href="/governance"
                  onClick={() => {
                    onMobileMenuOpenChange(false);
                  }}
                >
                  Governance
                </HeaderNavLink>
                <HeaderNavLink
                  href="/authz"
                  onClick={() => {
                    onMobileMenuOpenChange(false);
                  }}
                >
                  Authz
                </HeaderNavLink>
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
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export function AppWrapper({ children }: PropsWithChildren) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBlurred, setBlured] = useState(false);
  const isDesktop = useMediaQuery({
    query: `(min-width: 1024px)`,
  });
  const { chain } = useNetwork();
  const { connectAsync, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { closeSelectWallet, isSelectWalletOpen } = useWallet();

  const handleWalletConnect = useCallback(
    async (connectorIdx: number) => {
      await connectAsync({ connector: connectors[connectorIdx] });
      closeSelectWallet();
    },
    [closeSelectWallet, connectAsync, connectors],
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
    return chain?.id === haqqTestedge2.id;
  }, [chain?.id]);

  const selectWalletModalConnectors = useMemo(() => {
    return connectors.map((connector, index) => {
      return {
        id: index,
        name: connector.name,
        isPending: isLoading && pendingConnector?.id === connector.id,
      };
    });
  }, [connectors, isLoading, pendingConnector?.id]);

  return (
    <Page
      header={
        <Header
          darkBackground={isMobileMenuOpen}
          isBlurred={isBlurred}
          rightSlot={
            <HeaderButtons
              isMobileMenuOpen={isMobileMenuOpen}
              onMobileMenuOpenChange={setMobileMenuOpen}
            />
          }
        />
      }
      banner={isTestedge && <TestedgeBanner />}
    >
      {children}

      <SelectWalletModal
        isOpen={isSelectWalletOpen}
        connectors={selectWalletModalConnectors}
        error={error?.message}
        onConnectClick={handleWalletConnect}
        onClose={closeSelectWallet}
      />
    </Page>
  );
}
