import {
  Button2,
  Card,
  Heading,
  Modal,
  ModalCloseButton,
  SpinnerLoader,
} from '@haqq/ui-kit';
import clsx from 'clsx';
import { useConnect } from 'wagmi';

export function SelectWalletModal({
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
      <Card
        className={clsx(
          'mx-auto min-w-[320px] max-w-[420px] !bg-white dark:!bg-slate-700',
          className,
        )}
      >
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <Heading level={3} className="mt-[3px]">
              Select wallet
            </Heading>
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
                  <Button2
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
                  </Button2>
                );
              })}

              {error && (
                <div className="text-red-500 pt-4">{error.message}</div>
              )}
            </div>
          )}
        </div>
      </Card>
    </Modal>
  );
}
