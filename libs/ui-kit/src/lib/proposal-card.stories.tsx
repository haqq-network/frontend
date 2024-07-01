import { ProposalStatus } from '@evmos/provider';
import { Meta, StoryObj } from '@storybook/react';
import { ProposalCard as ProposalCardComponent } from './proposal-card';

const meta: Meta<typeof ProposalCardComponent> = {
  component: ProposalCardComponent,
  title: 'shell/ui-kit',
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
    depositEndDate: new Date('10-01-2023'),
    votingStartDate: new Date('10-01-2023'),
    votingEndDate: new Date('11-01-2023'),
    symbol: 'ISLM',
  },
};
