import type { Meta, StoryObj } from '@storybook/react';
import { Text as TextComponent } from './text';

const meta: Meta<typeof TextComponent> = {
  component: TextComponent,
  title: 'islamic-website/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TextComponent>;

export const Text: Story = {
  args: {
    children: 'Text',
    isMono: false,
    size: 'large',
  },
};
