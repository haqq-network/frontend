import { Fragment, PropsWithChildren } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export function Modal({
  children,
  onClose,
  isOpen = false,
}: PropsWithChildren<{ isOpen?: boolean; onClose: () => void }>) {
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
          <div
            role="none"
            className="bg-islamic-modal-overlay fixed inset-0 transform-gpu backdrop-blur"
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {children}
              </Transition.Child>
            </Dialog.Panel>
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
