import { ComponentMeta } from '@storybook/react';
import { Modal as ModalComponent, ModalProps } from './Modal';
import { Card } from '../../Card/Card';

export default {
  title: 'ui-kit/Modals',
  component: ModalComponent,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof ModalComponent>;

export const Modal = (args: ModalProps) => {
  return <ModalComponent {...args} />;
};
Modal.args = {
  isOpen: true,
  children: (
    <Card className="mx-auto max-w-md p-6">
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat
        error, qui odit adipisci quibusdam vero quam repellendus maiores,
        eveniet optio nesciunt veritatis deleniti aliquam quo! Ut nulla
        asperiores officia ducimus?
      </p>
    </Card>
  ),
};
