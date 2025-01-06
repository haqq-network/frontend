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
    voteResults: {
      yes: {
        count: '200',
        percentage: 20,
        countBigInt: BigInt(200),
      },
      abstain: {
        count: '300',
        percentage: 30,
        countBigInt: BigInt(300),
      },
      no: {
        count: '100',
        percentage: 10,
        countBigInt: BigInt(100),
      },
      noWithVeto: {
        count: '400',
        percentage: 40,
        countBigInt: BigInt(400),
      },
    },
  },
};
