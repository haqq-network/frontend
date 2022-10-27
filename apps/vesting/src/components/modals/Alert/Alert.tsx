import { ReactNode } from 'react';
import { Button } from '../../Button/Button';
import { Heading } from '../../Typography/Typography';
import { Modal, ModalCloseButton } from '../Modal/Modal';

export interface AlertProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onClick?: () => void;
}

export function Alert({
  isOpen,
  title,
  children,
  onClose,
  onClick,
}: AlertProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-max mx-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <Heading level={3}>{title}</Heading>
            <ModalCloseButton onClick={onClose} />
          </div>

          <div>{children}</div>

          {onClick && (
            <div className="text-right">
              <Button onClick={onClick} className="min-w-[120px]">
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
