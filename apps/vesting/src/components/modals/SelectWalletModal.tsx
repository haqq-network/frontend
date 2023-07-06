import { Button } from '../Button/Button';
import { Heading } from '../Typography/Typography';
import { Modal, ModalCloseButton } from './Modal/Modal';

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
      <div className="mx-auto max-w-[400px] rounded-[24px] bg-white p-8 shadow-md">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <Heading level={3}>Select wallet</Heading>
            <ModalCloseButton onClick={onClose} />
          </div>

          <div className="flex flex-col space-y-2">
            {connectors.map((connector) => {
              return (
                <Button
                  key={connector.id}
                  onClick={() => {
                    onConnectClick(connector.id);
                  }}
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
