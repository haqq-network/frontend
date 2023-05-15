import { Meta, StoryObj } from '@storybook/react';
import { ValidatorBlockMobile as ValidatorBlockMobileComponent } from './validator-block-mobile';

const meta: Meta<typeof ValidatorBlockMobileComponent> = {
  component: ValidatorBlockMobileComponent,
  title: 'shell/ui-kit',
};

export default meta;
type Story = StoryObj<typeof ValidatorBlockMobileComponent>;

export const ValidatorBlockMobile: Story = {
  args: {
    delegation: '11100',
    undelegate: '100',
    isDelegateDisabled: false,
    isGetRewardDisabled: false,
    isUndelegateDisabled: false,
    onDelegateClick: () => {
      console.log('delegate');
    },
    onGetRewardClick: () => {
      console.log('get reward');
    },
    onUndelegateClick: () => {
      console.log('undelegate');
    },
    rewards: '100',
  },
};
