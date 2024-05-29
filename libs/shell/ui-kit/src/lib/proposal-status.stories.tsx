import { ProposalStatus as ProposalStatusEnum } from '@evmos/provider';
import { Meta, StoryObj } from '@storybook/react';
import { ProposalStatus as ProposalStatusComponent } from './proposal-status';

const meta: Meta<typeof ProposalStatusComponent> = {
  component: ProposalStatusComponent,
  title: 'shell/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ProposalStatusComponent>;

export const ProposalStatus: Story = {
  args: {
    status: ProposalStatusEnum.Deposit,
  },
};
