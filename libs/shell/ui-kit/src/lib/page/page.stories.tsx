import { Container } from '../container/container';
import { Heading } from '../heading/heading';
import { Page as PageComponent } from './page';
import { withRouter } from 'storybook-addon-react-router-v6';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PageComponent> = {
  component: PageComponent,
  title: 'shell/ui-kit',
  decorators: [withRouter],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof PageComponent>;

export const Default: Story = {
  args: {
    className: 'text-white',
    children: "I'm a page component",
  },
};
