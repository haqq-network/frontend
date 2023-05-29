import { Tab as TabComponent } from './tabs';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TabComponent & typeof TabComponent> = {
  component: TabComponent,
  title: 'shell/ui-kit/tabs',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof TabComponent>;

export const ActiveTab: Story = {
  args: {
    children: 'Tab 1',
    isActive: true,
  },
};

export const NonActiveTab: Story = {
  args: {
    children: 'Tab 2',
    isActive: false,
  },
};
