import clsx from 'clsx';
import { Button } from '../button/button';
import { Modal, ModalCloseButton } from '../modal/modal';

export function ProposalDepositModal({
  isOpen,
  onClose,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}) {
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
            Deposit
          </div>

          <div className="flex flex-col space-y-[12px]">
            <Button>Confirm deposit</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
