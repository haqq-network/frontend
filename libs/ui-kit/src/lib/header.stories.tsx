/* eslint-disable @nx/enforce-module-boundaries */
import { Meta, StoryObj } from '@storybook/react';
import { Header as HeaderComponent } from './header';
import { withoutPadding } from '../../../storybook/src/decorators';

const meta: Meta<typeof HeaderComponent> = {
  component: HeaderComponent,
  title: 'shell/ui-kit/layout',
  decorators: [withoutPadding],
};

export default meta;
type Story = StoryObj<typeof HeaderComponent>;

export const Header: Story = {};
