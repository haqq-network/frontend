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
import { useBalance, useNetwork, useSwitchNetwork } from 'wagmi';
import ScrollLock from 'react-scrolllock';
import {
  Header,
  Page,
  BurgerButton,
  Button,
  AccountButton,
  SelectChainButton,
} from '@haqq/shell-ui-kit';
import { useMediaQuery } from 'react-responsive';
import { haqqTestedge2 } from 'viem/chains';

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
  const { switchNetwork } = useSwitchNetwork();
  const isDesktop = useMediaQuery({
    query: `(min-width: 1024px)`,
  });

  const handleChainSelectClick = useCallback(
    (chainId: number) => {
      if (switchNetwork) {
        switchNetwork(chainId);
      }
    },
    [switchNetwork],
  );

  const balance = useMemo(() => {
    if (!balanceData) {
      return undefined;
    }

    return {
      symbol: balanceData.symbol,
      value: Number.parseFloat(balanceData.formatted).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      }),
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

      <div className="block lg:hidden">
        <BurgerButton
          isOpen={isMobileMenuOpen}
          onClick={() => {
            onMobileMenuOpenChange(!isMobileMenuOpen);
          }}
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
    </Page>
  );
}

function TestedgeBanner() {
  return (
    <div className="bg-haqq-orange sticky bottom-0 z-50 select-none p-[8px] text-center font-serif text-[18px] leading-[24px] text-white">
      You are on test network
    </div>
  );
}
