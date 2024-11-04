'use client';
import clsx from 'clsx';
import { Button } from './button';
import { Modal, ModalCloseButton, ModalHeading } from './modal';

export function SelectWalletModal({
  isOpen,
  onClose,
  className,
  onConnectClick,
  connectors,
  error,
  isMobileUA,
  deeplink,
  isHaqqWallet,
}: {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  onConnectClick: (connectorId: number) => void;
  connectors: {
    id: number;
    name: string;
  }[];
  error: string | undefined;
  isMobileUA: boolean;
  deeplink: string;
  isHaqqWallet: boolean;
}) {
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

        <div className="flex w-full flex-col">
          <div className="pb-[24px] pt-[24px] sm:pt-[4px]">
            <ModalHeading>Select wallet</ModalHeading>
          </div>

          <div className="flex flex-col space-y-2">
            {isMobileUA && !isHaqqWallet && deeplink && (
              <div>
                <Button
                  className="min-w-[220px]"
                  onClick={() => {
                    window.location.href = deeplink;
                  }}
                  variant={4}
                >
                  Open in HAQQ Wallet
                </Button>
              </div>
            )}

            {connectors.map((connector) => {
              return (
                <div key={connector.id}>
                  <Button
                    className="min-w-[220px]"
                    onClick={() => {
                      onConnectClick(connector.id);
                    }}
                    variant={4}
                  >
                    {connector.name === 'WalletConnect'
                      ? isMobileUA
                        ? 'WalletConnect'
                        : 'Scan with HAQQ Wallet'
                      : connector.name}
                  </Button>
                </div>
              );
            })}

            {error && <div className="pt-4 text-red-500">{error}</div>}
          </div>
        </div>
      </div>
    </Modal>
  );
}
