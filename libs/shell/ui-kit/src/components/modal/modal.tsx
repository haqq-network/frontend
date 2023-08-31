import {
  Fragment,
  PropsWithChildren,
  SyntheticEvent,
  useCallback,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';

function ModalOverlay({ onClose }: { onClose: () => void }) {
  const handleKeydown = useCallback(
    (event: SyntheticEvent<HTMLDivElement, KeyboardEvent>) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.nativeEvent.code === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        role="none"
        className="bg-haqq-modal-overlay fixed inset-0 transform-gpu backdrop-blur"
        onClick={onClose}
        onKeyDown={handleKeydown}
      />
    </Transition.Child>
  );
}

export function ModalCloseButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={clsx(
        'h-[24px] w-[24px] cursor-pointer transition-opacity duration-100 ease-in-out hover:opacity-60',
        className,
      )}
      onClick={onClick}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0001 13.4142L17.293 18.7071L18.7072 17.2929L13.4143 12L18.7072 6.70712L17.293 5.29291L12.0001 10.5858L6.70718 5.29291L5.29297 6.70712L10.5859 12L5.29297 17.2929L6.70718 18.7071L12.0001 13.4142Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}

export function Modal({
  children,
  onClose,
  isOpen = false,
}: PropsWithChildren<{
  isOpen?: boolean;
  onClose: () => void;
}>) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <ModalOverlay onClose={onClose} />

        <div className="pointer-events-none fixed inset-0 overflow-y-auto">
          <div className="pointer-events-none flex min-h-full items-center justify-center sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="pointer-events-auto transform transition-all">
                {children}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export function MobileHeading({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <h3
      className={clsx(
        'font-serif text-[18px] font-[500] leading-[24px] md:text-[24px] md:leading-[30px]',
        className,
      )}
    >
      {children}
    </h3>
  );
}
