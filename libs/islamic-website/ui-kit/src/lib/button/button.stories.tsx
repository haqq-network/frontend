import type { Meta, StoryObj } from '@storybook/react';
import { Button as ButtonComponent } from './button';

const meta: Meta<typeof ButtonComponent> = {
  component: ButtonComponent,
  title: 'islamic-website/ui-kit/Button',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ButtonComponent>;

export const Default: Story = {
  args: {
    children: 'Button',
    isLoading: false,
    disabled: false,
  },
};

export const Transparent: Story = {
  args: {
    children: 'Button',
    variant: 'transparent',
    isLoading: false,
    disabled: false,
  },
};

export const Gradient: Story = {
  args: {
    children: 'Button',
    variant: 'gradient',
    isLoading: false,
    disabled: false,
  },
};
