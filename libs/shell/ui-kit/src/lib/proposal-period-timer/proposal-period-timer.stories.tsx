import { Meta, StoryObj } from '@storybook/react';
import { ProposalPeriodTimer as ProposalPeriodTimerComponent } from './proposal-period-timer';

const meta: Meta<typeof ProposalPeriodTimerComponent> = {
  component: ProposalPeriodTimerComponent,
  title: 'shell/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ProposalPeriodTimerComponent>;

export const ProposalPeriodTimer: Story = {
  args: {
    date: new Date('10-11-2023'),
  },
};
