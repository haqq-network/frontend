import { Meta, StoryObj } from '@storybook/react';
import { BackButton as BackButtonComponent } from './back-button';

const meta: Meta<typeof BackButtonComponent> = {
  component: BackButtonComponent,
  title: 'shell/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof BackButtonComponent>;

export const BackButton: Story = {
  args: {
    children: 'Back',
  },
};
