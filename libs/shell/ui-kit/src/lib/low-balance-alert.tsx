'use client';
import clsx from 'clsx';
import { ModalHeading, Modal, ModalCloseButton } from './modal';

export function LowBalanceAlert({
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
            <ModalHeading>Low balance</ModalHeading>
          </div>

          <div>
            <div className="font-guise text-[15px] leading-[24px]">
              Not enough balance for the commission fee. Transfer funds to your
              account to proceed.
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
