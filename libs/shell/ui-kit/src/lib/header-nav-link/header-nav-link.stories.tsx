import { withRouter } from 'storybook-addon-react-router-v6';
import { HeaderNavLink as HeaderNavLinkComponent } from './header-nav-link';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof HeaderNavLinkComponent> = {
  component: HeaderNavLinkComponent,
  title: 'shell/ui-kit/header-nav-link',
  decorators: [withRouter],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof HeaderNavLinkComponent>;

export const Default: Story = {
  args: {
    children: 'Default',
    href: '/',
  },
};

export const IsOut: Story = {
  args: {
    children: 'Is out',
    href: 'https://haqq.network/',
    isOutLink: true,
  },
};
