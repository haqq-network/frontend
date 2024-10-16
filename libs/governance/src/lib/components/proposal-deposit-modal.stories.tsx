import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ProposalDepositModal as ProposalDepositModalComponent } from './proposal-deposit-modal';

const meta: Meta<typeof ProposalDepositModalComponent> = {
  component: ProposalDepositModalComponent,
  title: 'shell/ui-kit/modals/plug-and-play',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ProposalDepositModalComponent>;

export const ProposalDepositModal: Story = {
  args: {
    isOpen: false,
    balance: 250.48819,
    onClose: fn(),
    onSubmit: fn(),
  },
};
