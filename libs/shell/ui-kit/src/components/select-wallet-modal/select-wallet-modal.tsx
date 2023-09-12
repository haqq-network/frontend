import clsx from 'clsx';
import { MobileHeading, Modal, ModalCloseButton } from '../modal/modal';
import { Button } from '../button/button';

export function SelectWalletModal({
  isOpen,
  onClose,
  className,
  onConnectClick,
  connectors,
  error,
}: {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  onConnectClick: (connectorId: number) => void;
  connectors: {
    id: number;
    name: string;
    isPending: boolean;
  }[];
  error: string | undefined;
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
            <MobileHeading>Select wallet</MobileHeading>
          </div>

          <div className="flex flex-col space-y-[12px]">
            {connectors.map((connector) => {
              return (
                <Button
                  key={connector.id}
                  onClick={() => {
                    onConnectClick(connector.id);
                  }}
                  variant={4}
                  isLoading={connector.isPending}
                  className={clsx(
                    connector.isPending
                      ? '!text-white'
                      : 'hover:!text-haqq-orange hover:!border-haqq-orange',
                  )}
                >
                  {connector.name}
                </Button>
              );
            })}

            {error && <div className="pt-4 text-red-500">{error}</div>}
          </div>
        </div>
      </div>
    </Modal>
  );
}
