import { Meta, StoryObj } from '@storybook/react';
import { OrangeLink as OrangeLinkComponent } from './orange-link';

const meta: Meta<typeof OrangeLinkComponent> = {
  component: OrangeLinkComponent,
  title: 'shell/ui-kit',
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
