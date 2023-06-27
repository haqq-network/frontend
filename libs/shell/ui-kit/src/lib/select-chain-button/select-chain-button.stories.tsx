import { SelectChainButton as SelectChainButtonComponent } from './select-chain-button';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SelectChainButtonComponent> = {
  component: SelectChainButtonComponent,
  title: 'shell/ui-kit/SelectChainButton',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SelectChainButtonComponent>;

const chains = [
  {
    id: 1,
    name: 'Mainnet',
  },
  {
    id: 2,
    name: 'Testedge 2',
  },
];

export const Default: Story = {
  args: {
    isSupported: true,
    chains,
    currentChain: chains[1],
  },
};

export const UnsupportedNetwork: Story = {
  args: {
    chains,
    currentChain: chains[2],
    isSupported: false,
  },
};
