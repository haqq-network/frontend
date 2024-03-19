import { Meta, StoryObj } from '@storybook/react';
import { HeaderNavLink as HeaderNavLinkComponent } from './header-nav-link';

const meta: Meta<typeof HeaderNavLinkComponent> = {
  component: HeaderNavLinkComponent,
  title: 'shell/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof HeaderNavLinkComponent>;

export const HeaderNavLink: Story = {
  args: {
    children: 'Default',
    href: '/',
  },
};
