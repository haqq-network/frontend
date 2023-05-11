// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Fragment, ReactNode, SyntheticEvent, useCallback } from 'react';
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
        className="fixed inset-0 backdrop-blur transform-gpu bg-islamic-modal-overlay"
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
        'cursor-pointer w-[24px] h-[24px] hover:text-slate-500 transition-colors duration-100 ease-in-out',
        className,
      )}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d="M6 6L18.7742 18.7742"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 18.7734L18.7742 5.99924"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ children, onClose, isOpen = false }: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <ModalOverlay onClose={onClose} />

        <div className="fixed inset-0 overflow-y-auto pointer-events-none">
          <div className="flex min-h-full items-center justify-center p-4 pointer-events-none">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="transform transition-all pointer-events-auto">
                {children}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
