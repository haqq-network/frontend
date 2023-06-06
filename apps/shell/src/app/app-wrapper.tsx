import {
  Fragment,
  PropsWithChildren,
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
  Modal,
  ModalCloseButton,
  MobileHeading,
} from '@haqq/shell/ui-kit';
import ScrollLock from 'react-scrolllock';
import { useBalance, useConnect } from 'wagmi';
import clsx from 'clsx';
import {
  getFormattedAddress,
  useAddress,
  useWallet,
  useWindowWidth,
} from '@haqq/shared';
import { useMediaQuery } from 'react-responsive';

interface HeaderButtonProps {
  isMobileMenuOpen: boolean;
  onMobileMenuOpenChange: (isMobileMenuOpen: boolean) => void;
}

function SelectWalletModal({
  isOpen,
  onClose,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}) {
  const { connectAsync, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className={clsx(
          'text-haqq-black mx-auto h-screen w-screen bg-white p-[16px] sm:mx-auto sm:h-auto sm:w-[430px] sm:rounded-[12px] sm:p-[36px]',
          className,
        )}
      >
        <ModalCloseButton
          onClick={onClose}
          className="absolute right-[16px] top-[16px]"
        />

        <div className="flex w-full flex-col space-y-6">
          <div className="divide-y divide-dashed divide-[#0D0D0E3D]">
            <div className="pb-[24px] pt-[24px] sm:pt-[4px]">
              <MobileHeading>Select wallet</MobileHeading>
            </div>

            <div className="flex flex-col space-y-[12px]">
              {connectors.map((connector) => {
                if (!connector.ready) {
                  return null;
                }

                const isPending =
                  isLoading && connector.id === pendingConnector?.id;

                return (
                  <Button
                    key={connector.id}
                    onClick={async () => {
                      await connectAsync({ connector });
                      onClose();
                    }}
                    variant={4}
                    isLoading={isPending}
                    className={clsx(
                      isPending
                        ? '!text-white'
                        : 'hover:!text-haqq-orange hover:!border-haqq-orange',
                    )}
                  >
                    {connector.name}
                  </Button>
                );
              })}

              {error && (
                <div className="pt-4 text-red-500">{error.message}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function HeaderButtons({
  isMobileMenuOpen,
  onMobileMenuOpenChange,
}: HeaderButtonProps) {
  const {
    disconnect,
    isSelectWalletOpen,
    openSelectWallet,
    closeSelectWallet,
  } = useWallet();
  const { ethAddress } = useAddress();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    watch: true,
  });
  const balance = useMemo(() => {
    if (!balanceData) {
      return undefined;
    }

    return {
      symbol: balanceData.symbol,
      value: Number.parseFloat(balanceData.formatted),
    };
  }, [balanceData]);
  const { width } = useWindowWidth();

  useEffect(() => {
    if (width >= 1024) {
      onMobileMenuOpenChange(false);
    }
  }, [onMobileMenuOpenChange, width]);

  return (
    <Fragment>
      <nav className="hidden flex-row items-center space-x-6 lg:flex">
        <HeaderNavLink href="/staking">Staking</HeaderNavLink>
        <HeaderNavLink href="/governance">Governance</HeaderNavLink>
      </nav>

      <div className="hidden pl-[80px] lg:block">
        {ethAddress ? (
          <AccountButton
            balance={balance}
            address={getFormattedAddress(ethAddress, 3, 2)}
            onDisconnectClick={disconnect}
          />
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

      <SelectWalletModal
        isOpen={isSelectWalletOpen}
        onClose={closeSelectWallet}
      />

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
              </div>

              {ethAddress && (
                <AccountButton
                  balance={balance}
                  address={ethAddress}
                  onDisconnectClick={disconnect}
                  withoutDropdown
                />
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

  useEffect(() => {
    function handleScroll() {
      const offset = isDesktop ? 60 : 30;
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
    >
      {children}
    </Page>
  );
}
