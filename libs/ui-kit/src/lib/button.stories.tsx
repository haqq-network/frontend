import { Meta, StoryObj } from '@storybook/react';
import { Button as ButtonComponent } from './button';

const meta: Meta<typeof ButtonComponent> = {
  component: ButtonComponent,
  title: 'shell/ui-kit/button',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ButtonComponent>;

export const FirstVariant: Story = {
  args: {
    children: 'First variant',
  },
};

export const SecondVariant: Story = {
  args: {
    children: 'Second variant',
    variant: 2,
  },
};
export const ThirdVariant: Story = {
  args: {
    children: 'Third variant',
    variant: 3,
  },
};
export const FourthVariant: Story = {
  args: {
    children: 'Fourth variant',
    variant: 4,
  },
};
export const FifthVariant: Story = {
  args: {
    children: 'Fifth variant',
    variant: 5,
  },
};
