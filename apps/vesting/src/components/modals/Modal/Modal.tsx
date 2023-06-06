// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Fragment, ReactNode, SyntheticEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import styled from '@emotion/styled';

export interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ModalOverlay = styled.div`
  --modal-overlay-bg-color: rgba(12, 12, 12, 0.4);

  background-color: var(--modal-overlay-bg-color);
`;

export function Modal({ children, onClose, isOpen = false }: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ModalOverlay
            role="none"
            className="fixed inset-0 transform-gpu backdrop-blur"
            onClick={onClose}
            onKeyDown={(
              event: SyntheticEvent<HTMLDivElement, KeyboardEvent>,
            ) => {
              event.preventDefault();
              event.stopPropagation();

              if (event.nativeEvent.code === 'Escape') {
                onClose();
              }
            }}
          />
        </Transition.Child>

        <div className="pointer-events-none fixed inset-0 overflow-y-auto">
          <div className="pointer-events-none flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="pointer-events-auto w-full transform transition-all">
                {children}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export function ModalCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="text-dark-gray hover:text-primary h-[24px] w-[24px] cursor-pointer"
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
