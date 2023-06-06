import { Meta, StoryObj } from '@storybook/react';
import { NotFoundPage as NotFoundPageComponent } from './not-found-page';

const meta: Meta<typeof NotFoundPageComponent> = {
  component: NotFoundPageComponent,
  title: 'shell/ui-kit',
};

export default meta;
type Story = StoryObj<typeof NotFoundPageComponent>;

export const NotFoundPage: Story = {};
