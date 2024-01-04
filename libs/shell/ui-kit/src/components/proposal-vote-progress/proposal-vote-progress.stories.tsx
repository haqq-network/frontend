import { Meta, StoryObj } from '@storybook/react';
import { ProposalVoteProgress as ProposalVoteProgressComponent } from './proposal-vote-progress';

const meta: Meta<typeof ProposalVoteProgressComponent> = {
  component: ProposalVoteProgressComponent,
  title: 'shell/ui-kit',
};

export default meta;
type Story = StoryObj<typeof ProposalVoteProgressComponent>;

export const ProposalVoteProgress: Story = {
  args: {
    results: {
      yes: '200',
      abstain: '300',
      no: '100',
      no_with_veto: '400',
    },
  },
};
