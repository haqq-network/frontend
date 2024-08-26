'use client';
import { Fragment, PropsWithChildren, SyntheticEvent } from 'react';
import { Dialog } from '@headlessui/react';
import clsx from 'clsx';

function ModalOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="none"
      className="bg-haqq-modal-overlay fixed inset-0 transform-gpu backdrop-blur"
      onClick={onClose}
      onKeyDown={(event: SyntheticEvent<HTMLDivElement, KeyboardEvent>) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.nativeEvent.code === 'Escape') {
          onClose();
        }
      }}
    />
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
    <Dialog as="div" className="relative z-50" onClose={onClose} open={isOpen}>
      <ModalOverlay onClose={onClose} />

      <div className="pointer-events-none fixed inset-0 overflow-y-auto">
        <div className="pointer-events-none flex min-h-full items-center justify-center sm:p-4">
          <div className="pointer-events-auto transform transition-all">
            {children}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export function ModalHeading({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <h3
      className={clsx(
        'font-clash text-[18px] font-[500] leading-[20px] md:text-[24px] md:leading-[26px]',
        className,
      )}
    >
      {children}
    </h3>
  );
}
