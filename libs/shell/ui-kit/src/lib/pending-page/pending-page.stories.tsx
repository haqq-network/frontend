import { PendingPage as PendingPageComponent } from './pending-page';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PendingPageComponent> = {
  component: PendingPageComponent,
  title: 'shell/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof PendingPageComponent>;

export const PendingPage: Story = {};
