import type { Meta, StoryObj } from '@storybook/react';
import { GradientText as GradientTextComponent } from './gradient-text';

const meta: Meta<typeof GradientTextComponent> = {
  component: GradientTextComponent,
  title: 'islamic-website/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof GradientTextComponent>;

export const GradientText: Story = {
  args: {
    children: 'Gradient Text',
  },
};
