import { Meta, StoryObj } from '@storybook/react';
import { SelectChainModal as SelectChainModalComponent } from './select-chain-modal';

const meta: Meta<typeof SelectChainModalComponent> = {
  component: SelectChainModalComponent,
  title: 'shell/ui-kit/modals/plug-and-play',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SelectChainModalComponent>;

export const SelectChainModal: Story = {
  args: {
    isOpen: true,
    chains: [
      {
        id: 1,
        name: 'HAQQ Mainnet',
      },
      {
        id: 2,
        name: 'HAQQ Testedge',
      },
    ],
  },
};
