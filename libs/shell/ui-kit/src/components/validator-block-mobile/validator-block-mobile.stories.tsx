import { Meta, StoryObj } from '@storybook/react';
import { ValidatorBlockMobile as ValidatorBlockMobileComponent } from './validator-block-mobile';
import {
  withoutPadding,
  withStickyEmulation,
} from '../../../../../storybook-host/.storybook/decorators';

const meta: Meta<typeof ValidatorBlockMobileComponent> = {
  component: ValidatorBlockMobileComponent,
  title: 'shell/ui-kit',
  decorators: [withoutPadding, withStickyEmulation],
};

export default meta;
type Story = StoryObj<typeof ValidatorBlockMobileComponent>;

export const ValidatorBlockMobile: Story = {
  args: {
    delegation: 11100,
    undelegate: 100,
    isDelegateDisabled: false,
    isGetRewardDisabled: false,
    isUndelegateDisabled: false,
    rewards: 100,
    symbol: 'ISLM',
  },
};
