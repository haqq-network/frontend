import { Meta, StoryObj } from '@storybook/react';
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
    isOpen: true,
    connectors,
  },
};

export const WithError: Story = {
  args: {
    isOpen: true,
    connectors,
    error: 'Something went wrong',
  },
};
