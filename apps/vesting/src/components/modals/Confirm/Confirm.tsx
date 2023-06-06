import { ReactNode } from 'react';
import { Button, DangerButton } from '../../Button/Button';
import { Heading } from '../../Typography/Typography';
import { Modal, ModalCloseButton } from '../Modal/Modal';

export interface ConfirmProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  buttonTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function Confirm({
  isOpen,
  title,
  children,
  onClose,
  buttonTitle,
  onConfirm,
}: ConfirmProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <Heading level={3}>{title}</Heading>
            {onClose && <ModalCloseButton onClick={onClose} />}
          </div>

          <div>{children}</div>

          <div className="flex flex-row justify-between">
            <div>
              <Button onClick={onClose} fill className="px-4 sm:px-10">
                Abort
              </Button>
            </div>
            <div>
              <DangerButton onClick={onConfirm} fill className="px-4 sm:px-10">
                {buttonTitle}
              </DangerButton>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
