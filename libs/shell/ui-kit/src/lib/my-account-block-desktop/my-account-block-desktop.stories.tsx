import { Meta, StoryObj } from '@storybook/react';
import { MyAccountBlockDesktop as MyAccountBlockDesktopComponent } from './my-account-block-desktop';

const meta: Meta<typeof MyAccountBlockDesktopComponent> = {
  component: MyAccountBlockDesktopComponent,
  title: 'shell/ui-kit/my-account-blocks',
};

export default meta;
type Story = StoryObj<typeof MyAccountBlockDesktopComponent>;

export const MyAccountBlockDesktop: Story = {
  args: {
    balance: 1000000000,
    totalRewards: 987765,
    delegated: 99999999999,
    unbounded: 1298373,
    onRewardsClaim: () => {
      console.log('onRewardsClaim');
    },
  },
};
