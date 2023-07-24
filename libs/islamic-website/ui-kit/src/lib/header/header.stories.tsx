import type { Meta, StoryObj } from '@storybook/react';

import { Header as HeaderComponent } from './header';

const meta: Meta<typeof HeaderComponent> = {
  component: HeaderComponent,
  title: 'islamic-website/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof HeaderComponent>;

export const Header: Story = {};
