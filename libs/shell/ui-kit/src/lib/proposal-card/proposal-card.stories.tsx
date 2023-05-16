import { Meta, StoryObj } from '@storybook/react';
import { ProposalCard as ProposalCardComponent } from './proposal-card';
import { ProposalStatus } from '@evmos/provider';

const meta: Meta<typeof ProposalCardComponent> = {
  component: ProposalCardComponent,
  title: 'shell/ui-kit',
  // parameters: {
  //   layout: 'centered',
  // },
};

export default meta;
type Story = StoryObj<typeof ProposalCardComponent>;

export const ProposalCard: Story = {
  args: {
    id: 1,
    status: ProposalStatus.Deposit,
    title: 'Test proposal',
    results: {
      yes: '5000',
      abstain: '100',
      no: '3000',
      no_with_veto: '50',
    },
  },
};
