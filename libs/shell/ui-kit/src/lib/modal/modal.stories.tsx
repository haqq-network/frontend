import { useState } from 'react';
import { Modal as ModalComponent } from './modal';

export default {
  title: 'shell/ui-kit/modal',
  layout: 'centered',
};

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div
        onClick={() => {
          return setIsOpen(!isOpen);
        }}
      >
        Open modal
      </div>
      <ModalComponent
        onClose={() => {
          return setIsOpen(!isOpen);
        }}
        isOpen={isOpen}
      >
        Modal content
      </ModalComponent>
    </div>
  );
};
