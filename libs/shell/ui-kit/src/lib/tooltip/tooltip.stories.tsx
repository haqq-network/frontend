import { Tooltip as TooltipComponent } from './tooltip';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TooltipComponent> = {
  component: TooltipComponent,
  title: 'shell/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TooltipComponent>;

export const Tooltip: Story = {
  args: {
    children: "I'm a tooltip children!",
    text: 'Click to copy 0x5D62DB16Ee4DA021f2644017380E1D4Cb02Bc78D',
  },
};
