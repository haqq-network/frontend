import { Meta, StoryObj } from '@storybook/react';
import { MyAccountBlockMobileNew as MyAccountBlockMobileNewComponent } from './my-account-block-mobile';

const meta: Meta<typeof MyAccountBlockMobileNewComponent> = {
  component: MyAccountBlockMobileNewComponent,
  title: 'shell/ui-kit/my-account-blocks',
};

export default meta;
type Story = StoryObj<typeof MyAccountBlockMobileNewComponent>;

export const MyAccountBlockMobile: Story = {
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
