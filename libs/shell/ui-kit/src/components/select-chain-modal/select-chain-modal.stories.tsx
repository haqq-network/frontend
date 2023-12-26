import { Meta, StoryObj } from '@storybook/react';
import { SelectChainModal as SelectChainModalComponent } from './select-chain-modal';

const meta: Meta<typeof SelectChainModalComponent> = {
  component: SelectChainModalComponent,
  title: 'shell/ui-kit/SelectChainModal',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SelectChainModalComponent>;

const chains = [
  {
    id: 1,
    name: 'Brave Wallet',
  },
  {
    id: 2,
    name: 'ConnectWallet',
  },
];

export const Default: Story = {
  args: {
    isOpen: true,
    chains,
  },
};

export const WithError: Story = {
  args: {
    isOpen: true,
    chains,
    error: 'Something went wrong',
  },
};
