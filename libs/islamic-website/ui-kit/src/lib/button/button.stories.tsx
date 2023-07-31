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

export const PrimaryGreen: Story = {
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

export const ClassicGreen: Story = {
  args: {
    children: 'Button',
    variant: 'islamic-classic-green',
    isLoading: false,
    disabled: false,
  },
};

export const WithArrow: Story = {
  args: {
    children: 'With arrow',
    variant: 'islamic-classic-green',
    isLoading: false,
    disabled: false,
    withArrow: true,
  },
};
