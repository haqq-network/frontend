import { Meta, StoryObj } from '@storybook/react';
import { Address as AddressComponent } from './address';

const meta: Meta<typeof AddressComponent> = {
  component: AddressComponent,
  title: 'shell/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AddressComponent>;

export const Address: Story = {
  args: {
    address: '0xf73296e11b29bae9a9ee54dee08595d40dd38d5b',
  },
};
