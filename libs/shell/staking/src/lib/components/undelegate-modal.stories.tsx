import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { UndelegateModal as UndelegateModalComponent } from './undelegate-modal';

const meta: Meta<typeof UndelegateModalComponent> = {
  component: UndelegateModalComponent,
  title: 'shell/ui-kit/modals/plug-and-play',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof UndelegateModalComponent>;

export const UndelegateModal: Story = {
  args: {
    isOpen: false,
    symbol: 'islm',
    delegation: 1000,
    balance: 100,
    unboundingTime: 10,
    undelegateAmount: 100,
    onChange: fn(),
    onClose: fn(),
    onSubmit: fn(),
  },
};
