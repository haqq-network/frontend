import { Meta, StoryObj } from '@storybook/react';
import { ValidatorListItemMobile as ValidatorListItemMobileComponent } from './validator-list-item-mobile';

const meta: Meta<typeof ValidatorListItemMobileComponent> = {
  component: ValidatorListItemMobileComponent,
  title: 'shell/ui-kit',
};

export default meta;
type Story = StoryObj<typeof ValidatorListItemMobileComponent>;

export const ValidatorListItemMobile: Story = {
  args: {
    validatorName: 'Active Validator',
    fee: '10%',
    reward: (100).toLocaleString(),
    staked: '1000',
    votingPower: `${(12000000000000000).toLocaleString()} ISLM`,
    votingPowerPercent: '25%',
    status: 'active',
  },
};
