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
    children: 'Hover me!',
    text: (
      <div className="min-w-[260px]">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit.
      </div>
    ),
  },
};
