import { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { withoutPadding } from '../../../.storybook/decorators';
import { Header as HeaderComponent } from './header';

const meta: Meta<typeof HeaderComponent> = {
  component: HeaderComponent,
  title: 'shell/ui-kit/layout',
  decorators: [withRouter, withoutPadding],
};

export default meta;
type Story = StoryObj<typeof HeaderComponent>;

export const Header: Story = {};
