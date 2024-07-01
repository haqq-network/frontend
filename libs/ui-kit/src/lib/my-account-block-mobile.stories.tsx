/* eslint-disable @nx/enforce-module-boundaries */
import { Meta, StoryObj } from '@storybook/react';
import { MyAccountBlockMobile as MyAccountBlockMobileComponent } from './my-account-block-mobile';
import {
  withStickyEmulation,
  withoutPadding,
} from '../../../storybook/src/decorators';

const meta: Meta<typeof MyAccountBlockMobileComponent> = {
  component: MyAccountBlockMobileComponent,
  title: 'shell/ui-kit',
  decorators: [withoutPadding, withStickyEmulation],
};

export default meta;
type Story = StoryObj<typeof MyAccountBlockMobileComponent>;

export const MyAccountBlockMobile: Story = {
  args: {
    balance: 1000000000,
    totalRewards: 987765,
    delegated: 99999999999,
    unbounded: 1298373,
    symbol: 'ISLM',
  },
};
