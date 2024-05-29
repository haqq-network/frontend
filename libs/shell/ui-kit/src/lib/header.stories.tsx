/* eslint-disable @nx/enforce-module-boundaries */
import { Meta, StoryObj } from '@storybook/react';
import { withoutPadding } from '../../../../storybook-host/src/decorators';
import { Header as HeaderComponent } from '../components/header/header';

const meta: Meta<typeof HeaderComponent> = {
  component: HeaderComponent,
  title: 'shell/ui-kit/layout',
  decorators: [withoutPadding],
};

export default meta;
type Story = StoryObj<typeof HeaderComponent>;

export const Header: Story = {};
