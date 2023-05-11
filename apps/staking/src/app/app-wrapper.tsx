import { Fragment, ReactNode, useMemo, useState } from 'react';
import { useAddress, useWallet } from '@haqq/shared';
import { useBalance, useConnect } from 'wagmi';
import ScrollLock from 'react-scrolllock';
import {
  Header,
  Page,
  BurgerButton,
  Button,
  AccountButton,
} from '@haqq/shell/ui-kit-next';
import { Modal, ModalCloseButton } from '@haqq/ui-kit';
import clsx from 'clsx';

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
          'mx-auto bg-white text-haqq-black rounded-[12px] p-[36px]',
          className,
        )}
      >
        <ModalCloseButton
          onClick={onClose}
          className="absolute top-[16px] right-[16px]"
        />

        <div className="flex flex-col space-y-6 min-w-[360px] w-full">
          <div className="mt-[4x] text-[24px] leading-[30px] font-[500] font-serif">
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

            {error && <div className="text-red-500 pt-4">{error.message}</div>}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function HeaderButtons() {
  const [isOpen, setOpen] = useState(false);
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
      <div className="hidden lg:block pl-[80px]">
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
          isOpen={isOpen}
          onClick={() => {
            setOpen(!isOpen);
          }}
        />
      </div>

      <SelectWalletModal
        isOpen={isSelectWalletOpen}
        onClose={closeSelectWallet}
      />

      {isOpen && (
        <Fragment>
          <ScrollLock isActive />

          <div className="backdrop-blur transform-gpu fixed lg:hidden top-[64px] w-full h-[calc(100vh-64px)] right-0 z-40  bg-[#0D0D0E]">
            <div className="px-[24px] py-[32px] overflow-y-auto">
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

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <Page header={<Header rightSlot={<HeaderButtons />} />}>{children}</Page>
  );
}
