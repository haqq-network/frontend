import clsx from 'clsx';
import { Modal, ModalCloseButton, ModalHeading } from '@haqq/shell-ui-kit';

export function ConfirmModal({
  isOpen,
  onClose,
  balance,
  address,
  tokens,
  onConfirm,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  balance: string;
  tokens: string;
  address: string;
  className?: string;
}) {
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
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

          <div className="flex flex-col gap-[24px]">
            <div className="font-guise text-[12px] leading-[18px]">
              You confirm you want to transfer coins ownership in DAO{' '}
              <b>{balance} ISLM</b> and <b>{tokens} LIQUID</b> - to the address{' '}
              <b>{address}</b> ?
            </div>
            <div className="flex flex-row gap-[16px]">
              <div className="flex-1">
                <button
                  className={clsx(
                    'relative h-[40px] rounded-[6px] px-[16px] py-[13px] outline-none md:px-[32px]',
                    'font-clash text-[14px] font-[500] uppercase leading-[14px] tracking-[0.01em]',
                    'user-select-none cursor-pointer',
                    'w-full',
                    'bg-[#FF5454] text-[#0D0D0E]',
                  )}
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
              <div className="flex-1">
                <button
                  className={clsx(
                    'relative h-[40px] rounded-[6px] px-[16px] py-[13px] outline-none md:px-[32px]',
                    'font-clash text-[14px] font-[500] uppercase leading-[14px] tracking-[0.01em]',
                    'user-select-none cursor-pointer',
                    'w-full',
                    'bg-[#01B26E] text-[#0D0D0E]',
                  )}
                  onClick={onConfirm}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
