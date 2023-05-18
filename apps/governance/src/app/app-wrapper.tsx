import { Fragment, PropsWithChildren, useMemo, useState } from 'react';
import { useAddress, useWallet } from '@haqq/shared';
import { useBalance, useConnect } from 'wagmi';
import ScrollLock from 'react-scrolllock';
import {
  Header,
  Page,
  BurgerButton,
  Button,
  AccountButton,
  Modal,
  ModalCloseButton,
} from '@haqq/shell/ui-kit';
import clsx from 'clsx';

type ToggleMobileMenu = (isDark: boolean) => void;

interface HeaderButtonProps {
  isMobileMenuOpen: boolean;
  onMobileMenuOpenChange: ToggleMobileMenu;
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
          'text-haqq-black mx-auto rounded-[12px] bg-white p-[36px]',
          className,
        )}
      >
        <ModalCloseButton
          onClick={onClose}
          className="absolute right-[16px] top-[16px]"
        />

        <div className="flex w-full min-w-[360px] flex-col space-y-6">
          <div className="mt-[4x] font-serif text-[24px] font-[500] leading-[30px]">
            Select wallet
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

            {error && <div className="pt-4 text-red-500">{error.message}</div>}
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

  return (
    <Fragment>
      <div className="hidden pl-[80px] lg:block">
        {ethAddress ? (
          <AccountButton
            balance={balance}
            address={ethAddress}
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
          <div className="fixed right-0 top-[62px] z-40 h-[calc(100vh-62px)] w-full transform-gpu bg-[#0D0D0E] backdrop-blur sm:top-[71px] sm:h-[calc(100vh-71px)] lg:hidden">
            <div className="overflow-y-auto px-[24px] py-[32px]">
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
  return (
    <Page
      header={
        <Header
          darkBackground={isMobileMenuOpen}
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
