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
    minutes: 49,
    hours: 10,
    days: 10,
  },
};
