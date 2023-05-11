import { Modal, ModalCloseButton, SpinnerLoader } from '@haqq/ui-kit';
import { Button } from '@haqq/website/ui-kit';
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

          {isLoading ? (
            <SpinnerLoader className="!fill-haqq-orange mx-auto my-6" />
          ) : (
            <div className="flex flex-col space-y-[12px]">
              {connectors.map((connector) => {
                if (!connector.ready) {
                  return null;
                }

                return (
                  <Button
                    key={connector.id}
                    onClick={async () => {
                      await connectAsync({ connector });
                      onClose();
                    }}
                    variant={4}
                    className="hover:!border-haqq-orange hover:!text-haqq-orange"
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
