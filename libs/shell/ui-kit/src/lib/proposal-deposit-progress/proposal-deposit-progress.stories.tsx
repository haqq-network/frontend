import { Meta, StoryObj } from '@storybook/react';
import { ProposalDepositProgress as ProposalDepositProgressComponent } from './proposal-deposit-progress';

const meta: Meta<typeof ProposalDepositProgressComponent> = {
  component: ProposalDepositProgressComponent,
  title: 'shell/ui-kit',
};

export default meta;
type Story = StoryObj<typeof ProposalDepositProgressComponent>;

export const ProposalDepositProgress: Story = {
  args: {
    minDeposit: 250,
    totalDeposit: 42,
    userDeposit: undefined,
    symbol: 'ISLM',
  },
};
