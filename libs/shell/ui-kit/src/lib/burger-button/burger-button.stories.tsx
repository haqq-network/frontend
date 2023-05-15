import { useState } from 'react';
import { BurgerButton as BurgerButtonComponent } from './burger-button';

export default {
  title: 'shell/ui-kit/burger-button',
  parameters: {
    layout: 'centered',
  },
};

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <BurgerButtonComponent
      onClick={() => {
        return setIsOpen(!isOpen);
      }}
      isOpen={isOpen}
    />
  );
};
