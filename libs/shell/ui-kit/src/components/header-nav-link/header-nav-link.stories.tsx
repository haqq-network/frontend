import { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { HeaderNavLink as HeaderNavLinkComponent } from './header-nav-link';

const meta: Meta<typeof HeaderNavLinkComponent> = {
  component: HeaderNavLinkComponent,
  title: 'shell/ui-kit',
  decorators: [withRouter],
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
