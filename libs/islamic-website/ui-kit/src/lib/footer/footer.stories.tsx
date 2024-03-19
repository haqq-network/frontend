/* eslint-disable @nx/enforce-module-boundaries */
import type { Meta, StoryObj } from '@storybook/react';
import { Footer as FooterComponent } from './footer';
import { withoutPadding } from '../../../../../storybook-host/src/decorators';

const meta: Meta<typeof FooterComponent> = {
  component: FooterComponent,
  title: 'islamic-website/ui-kit',
  parameters: {
    layout: 'centered',
  },
  decorators: [withoutPadding],
};

export default meta;
type Story = StoryObj<typeof FooterComponent>;

export const Footer: Story = {};
