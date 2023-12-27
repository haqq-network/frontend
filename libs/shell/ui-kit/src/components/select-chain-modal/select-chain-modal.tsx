import clsx from 'clsx';
import { MobileHeading, Modal, ModalCloseButton } from '../modal/modal';
import { Button } from '../button/button';

export function SelectChainModal({
  isOpen,
  onClose,
  className,
  onChainSelect,
  chains,
}: {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  chains: { id: number; name: string }[];
  onChainSelect: (chainId: number) => void;
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

        <div className="flex w-full flex-col gap-[24px] pt-[24px] sm:pt-[4px]">
          <div>
            <MobileHeading>Select network</MobileHeading>
          </div>

          <div>
            <div className="font-guise text-[15px] leading-[24px]">
              Your current action cannot be performed as the application is
              connected to an unsupported network. Please select one of the
              supported networks from the list below to proceed.
            </div>
          </div>

          <div className="flex flex-col space-y-[12px]">
            {chains.map((chain) => {
              return (
                <Button
                  key={chain.id}
                  onClick={() => {
                    onChainSelect(chain.id);
                  }}
                  variant={4}
                  className="hover:text-haqq-orange hover:border-haqq-orange"
                >
                  {chain.name}
                </Button>
              );
            })}

            {/* {error && <div className="pt-4 text-red-500">{error}</div>} */}
          </div>
        </div>
      </div>
    </Modal>
  );
}
