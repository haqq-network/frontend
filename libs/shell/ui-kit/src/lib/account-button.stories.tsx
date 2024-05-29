import { Meta, StoryObj } from '@storybook/react';
import { AccountButton as AccountButtonComponent } from './account-button';

const meta: Meta<typeof AccountButtonComponent> = {
  component: AccountButtonComponent,
  title: 'shell/ui-kit/AccountButton',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AccountButtonComponent>;

export const Default: Story = {
  args: {
    address: '0xa•••e5',
    balance: {
      symbol: 'islm',
      value: 21010030,
    },
  },
};

export const WithoutDropdown: Story = {
  args: {
    address: '0xa•••e5',
    balance: {
      symbol: 'eth',
      value: 32,
    },
    withoutDropdown: true,
  },
};
