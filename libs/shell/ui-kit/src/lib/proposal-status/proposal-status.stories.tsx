import { Meta, StoryObj } from '@storybook/react';
import { ProposalStatus as ProposalStatusComponent } from './proposal-status';
import { ProposalStatus as ProposalStatusEnum } from '@evmos/provider';

const meta: Meta<typeof ProposalStatusComponent> = {
  component: ProposalStatusComponent,
  title: 'shell/ui-kit/ProposalStatus',
};

export default meta;
type Story = StoryObj<typeof ProposalStatusComponent>;

export const ProposalStatus: Story = {
  args: {
    status: ProposalStatusEnum.Deposit,
  },
};
