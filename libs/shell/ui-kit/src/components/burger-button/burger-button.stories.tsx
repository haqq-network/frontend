import { BurgerButton as BurgerButtonComponent } from './burger-button';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BurgerButtonComponent> = {
  component: BurgerButtonComponent,
  title: 'shell/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof BurgerButtonComponent>;

export const BurgerButton: Story = {
  args: {
    isOpen: false,
  },
};
