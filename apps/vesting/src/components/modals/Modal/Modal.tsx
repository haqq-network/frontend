import { PropsWithChildren } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';

export function Modal({
  children,
  onClose,
  isOpen = false,
}: PropsWithChildren<{ isOpen?: boolean; onClose: () => void }>) {
  return (
    <Dialog as="div" className="relative z-50" onClose={onClose} open={isOpen}>
      <div
        role="none"
        className="bg-islamic-modal-overlay fixed inset-0 transform-gpu backdrop-blur"
      />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel>{children}</DialogPanel>
        </div>
      </div>
    </Dialog>
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
