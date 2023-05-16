import { withRouter } from 'storybook-addon-react-router-v6';
import { OrangeLink as OrangeLinkComponent } from './orange-link';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof OrangeLinkComponent> = {
  component: OrangeLinkComponent,
  title: 'shell/ui-kit',
  decorators: [withRouter],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof OrangeLinkComponent>;

export const OrangeLinkDefault: Story = {
  args: {
    href: '/',
    children: 'Orange link default',
  },
};

export const OrangeLinkWithTarget: Story = {
  args: {
    href: 'https://haqq.network/',
    rel: 'noopener noreferrer',
    target: '_blank',
    children: 'Orange link with target',
  },
};
