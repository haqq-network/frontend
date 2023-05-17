import { BackButton as BackButtonComponent } from './back-button';
import { withRouter } from 'storybook-addon-react-router-v6';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BackButtonComponent> = {
  component: BackButtonComponent,
  title: 'shell/ui-kit',
  decorators: [withRouter],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof BackButtonComponent>;

export const BackButton: Story = {
  args: {
    children: 'Default',
    onClick: () => {
      console.log('Go back');
    },
  },
};
