import { Heading as HeadingComponent } from './heading';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof HeadingComponent> = {
  component: HeadingComponent,
  title: 'shell/ui-kit/heading',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof HeadingComponent>;

export const Heading1: Story = {
  args: {
    level: 1,
    children: 'Level 1',
  },
};

export const Heading2: Story = {
  args: {
    level: 2,
    children: 'Level 2',
  },
};
export const Heading3: Story = {
  args: {
    level: 3,
    children: 'Level 3',
  },
};
