import type { Meta, StoryObj } from '@storybook/react';
import { HeaderLink as HeaderLinkComponent } from './header';

const meta: Meta<typeof HeaderLinkComponent> = {
  component: HeaderLinkComponent,
  title: 'islamic-website/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof HeaderLinkComponent>;

export const HeaderLink: Story = {
  args: {
    children: 'Home',
    url: '/',
  },
};
