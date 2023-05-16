import { withRouter } from 'storybook-addon-react-router-v6';
import { OrangeLink as OrangeLinkComponent } from './orange-link';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof OrangeLinkComponent> = {
  component: OrangeLinkComponent,
  title: 'shell/ui-kit/orange-link',
  decorators: [withRouter],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof OrangeLinkComponent>;

export const Default: Story = {
  args: {
    href: '/',
    children: 'Orange link default',
  },
};

export const WithTarget: Story = {
  args: {
    href: 'https://haqq.network/',
    rel: 'noopener noreferrer',
    target: '_blank',
    children: 'Orange link with target',
  },
};
