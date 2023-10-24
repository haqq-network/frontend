import { Meta, StoryObj } from '@storybook/react';
import { StakedVestedBalance as StakedVestedBalanceComponent } from './staked-vested-balance';

const meta: Meta<typeof StakedVestedBalanceComponent> = {
  component: StakedVestedBalanceComponent,
  title: 'shell/ui-kit/Staked Vested Balance',
};

export default meta;
type Story = StoryObj<typeof StakedVestedBalanceComponent>;

export const Default: Story = {
  args: {
    staked: 40,
    vested: 60,
  },
};

export const StakedZero: Story = {
  args: {
    staked: 0,
    vested: 100,
  },
};

export const VestedZero: Story = {
  args: {
    staked: 100,
    vested: 0,
  },
};

export const NoVestingOrStake: Story = {
  args: {
    staked: 0,
    vested: 0,
  },
};
