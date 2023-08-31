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

export const OrangeLink: Story = {
  args: {
    children: 'Orange link default',
  },
};
