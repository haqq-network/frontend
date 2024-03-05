import { Meta, StoryObj } from '@storybook/react';
import { DelegateModal as DelegateModalComponent } from './delegate-modal';

const meta: Meta<typeof DelegateModalComponent> = {
  component: DelegateModalComponent,
  title: 'shell/ui-kit/modals/plug-and-play',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DelegateModalComponent>;

export const DelegateModal: Story = {
  args: {
    isOpen: true,
    symbol: 'islm',
    balance: 10000,
    delegation: 1000,
    isDisabled: false,
    unboundingTime: 21,
    validatorCommission: 10,
  },
};
