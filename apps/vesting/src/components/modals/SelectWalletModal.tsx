import { SpinnerLoader } from '../../pages/PendingPage';
import { Button } from '../Button/Button';
import { Heading } from '../Typography/Typography';
import { Modal, ModalCloseButton } from './Modal/Modal';
import { useConnect } from 'wagmi';

export function SelectWalletModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { connectAsync, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mx-auto max-w-[400px] rounded-[24px] bg-white p-8 shadow-md">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <Heading level={3}>Select wallet</Heading>
            <ModalCloseButton onClick={onClose} />
          </div>
          {isLoading ? (
            <SpinnerLoader className="!fill-primary mx-auto my-6" />
          ) : (
            <div className="flex flex-col space-y-2">
              {connectors.map((connector) => {
                if (!connector.ready) {
                  return null;
                }

                return (
                  <Button
                    fill
                    key={connector.id}
                    onClick={async () => {
                      await connectAsync({ connector });
                      onClose();
                    }}
                  >
                    {connector.name}
                    {isLoading &&
                      connector.id === pendingConnector?.id &&
                      ' (connecting)'}
                  </Button>
                );
              })}

              {error && (
                <div className="pt-4 text-red-500">{error.message}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
