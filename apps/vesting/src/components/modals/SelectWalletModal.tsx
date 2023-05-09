import { SpinnerLoader } from '@haqq/ui-kit';
import { Button } from '../Button/Button';
import { Heading } from '../Typography/Typography';
import { Modal, ModalCloseButton } from './Modal/Modal';
import { useConnect } from 'wagmi';

export function SelectWalletModal({ isOpen, onClose }: any) {
  const { connectAsync, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-[24px] max-w-[400px] mx-auto p-8">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
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
                <div className="text-red-500 pt-4">{error.message}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
