import {
  Fragment,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getFormattedAddress,
  useAddress,
  useSupportedChains,
  useWallet,
} from '@haqq/shared';
import { useBalance, useConnect, useNetwork, useSwitchNetwork } from 'wagmi';
import ScrollLock from 'react-scrolllock';
import {
  Header,
  Page,
  BurgerButton,
  Button,
  AccountButton,
  SelectChainButton,
  SelectWalletModal,
  TestedgeBanner,
  formatNumber,
  CommitSha,
  Footer,
  SelectChainModal,
} from '@haqq/shell-ui-kit';
import { useMediaQuery } from 'react-responsive';
import { haqqTestedge2 } from '@wagmi/chains';
import { useNavigate } from 'react-router-dom';
import { environment } from '../environments/environment';

function HeaderButtons({
  isMobileMenuOpen,
  onMobileMenuOpenChange,
}: {
  isMobileMenuOpen: boolean;
  onMobileMenuOpenChange: (isMobileMenuOpen: boolean) => void;
}) {
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
      <div className="hidden pl-[80px] lg:block">
        {ethAddress ? (
          <div className="flex flex-row gap-[24px]">
            <SelectChainButton
              {...selectChainButtonProps}
              onChainSelect={async (chainId) => {
                await selectNetwork(chainId);
                navigate('/');
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

          <div className="bg-haqq-black fixed right-0 top-[61px] z-40 h-[calc(100vh-61px)] w-full transform-gpu sm:top-[71px] sm:h-[calc(100vh-71px)] lg:hidden">
            <div className="flex flex-col gap-[24px] overflow-y-auto px-[24px] py-[32px]">
              {ethAddress && (
                <Fragment>
                  <div>
                    <SelectChainButton
                      {...selectChainButtonProps}
                      onChainSelect={handleChainSelectClick}
                    />
                  </div>

                  <div>
                    <AccountButton
                      balance={balance}
                      address={getFormattedAddress(ethAddress, 3, 2)}
                      onDisconnectClick={disconnect}
                      withoutDropdown
                    />
                  </div>
                </Fragment>
              )}

              <div>
                {ethAddress ? (
                  <Button onClick={disconnect}>Disconnect</Button>
                ) : (
                  <Button onClick={openSelectWallet}>Connect wallet</Button>
                )}
              </div>

              <div className="absolute bottom-[8px] left-[20px]">
                <div className="text-[12px] leading-[16px] text-white/20">
                  <CommitSha
                    commitSha={environment.commitSha}
                    className="transition-colors duration-150 hover:text-white/80"
                  />
                </div>
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
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { connectAsync, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const {
    closeSelectWallet,
    isSelectWalletOpen,
    isSelectChainOpen,
    closeSelectChain,
    selectNetwork,
  } = useWallet();

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
      footer={<Footer commitSha={environment.commitSha} />}
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
    </Page>
  );
}
