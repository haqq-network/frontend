import type { Meta, StoryObj } from '@storybook/react';

import { Footer as FooterComponent } from './footer';

const meta: Meta<typeof FooterComponent> = {
  component: FooterComponent,
  title: 'islamic-website/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FooterComponent>;

export const Footer: Story = {};
