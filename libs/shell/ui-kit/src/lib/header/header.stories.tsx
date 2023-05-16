import { withRouter } from 'storybook-addon-react-router-v6';
import { Header as HeaderComponent } from './header';
import { withoutPadding } from '../../../.storybook/decorators';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof HeaderComponent> = {
  component: HeaderComponent,
  title: 'shell/ui-kit',
  decorators: [withRouter, withoutPadding],
};

export default meta;
type Story = StoryObj<typeof HeaderComponent>;

export const Header: Story = {};
