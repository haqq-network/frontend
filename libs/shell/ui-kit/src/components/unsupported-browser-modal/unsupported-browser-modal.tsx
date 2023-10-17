import clsx from 'clsx';
import { MobileHeading, Modal, ModalCloseButton } from '../modal/modal';

export function UnsupportedBrowserModal({
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
          'text-haqq-black mx-auto h-screen w-screen bg-white p-[16px] sm:mx-auto sm:h-[400px] sm:w-[400px] sm:rounded-[12px] sm:p-[36px]',
          className,
        )}
      >
        <ModalCloseButton
          onClick={onClose}
          className="absolute right-[16px] top-[16px]"
        />

        <div className="flex h-full w-full flex-col items-center justify-center gap-[24px]">
          <div className="pt-[24px] text-center">
            <MobileHeading>Your browser does not support web 3.0</MobileHeading>
          </div>

          <div className="font-guise text-center text-[15px] leading-[24px]">
            Visit this page from a supported browser. Such a browser is
            available in metamask, trust wallet, etc. applications.
          </div>
        </div>
      </div>
    </Modal>
  );
}
