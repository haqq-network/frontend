import { Container as ContainerComponent } from './container';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ContainerComponent> = {
  component: ContainerComponent,
  title: 'shell/ui-kit',
};

export default meta;
type Story = StoryObj<typeof ContainerComponent>;

export const Container: Story = {
  args: {
    children: "I'm a containers children",
    className: 'border border-red-300 p-4',
  },
};
