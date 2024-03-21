import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SelectWalletModal as SelectWalletModalComponent } from './select-wallet-modal';

const meta: Meta<typeof SelectWalletModalComponent> = {
  component: SelectWalletModalComponent,
  title: 'shell/ui-kit/modals/plug-and-play/SelectWalletModal',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SelectWalletModalComponent>;

const connectors = [
  {
    id: 1,
    name: 'Brave Wallet',
    isPending: false,
  },
  {
    id: 2,
    name: 'ConnectWallet',
    isPending: false,
  },
];

export const Default: Story = {
  args: {
    isOpen: false,
    connectors,
    onClose: fn(),
    onConnectClick: fn(),
  },
};

export const WithError: Story = {
  args: {
    isOpen: false,
    connectors,
    error: 'Something went wrong',
    onClose: fn(),
    onConnectClick: fn(),
  },
};
