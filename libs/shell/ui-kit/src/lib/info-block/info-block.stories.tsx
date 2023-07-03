import { Meta, StoryObj } from '@storybook/react';
import { InfoBlock as InfoBlockComponent } from './info-block';

const meta: Meta<typeof InfoBlockComponent> = {
  component: InfoBlockComponent,
  title: 'shell/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof InfoBlockComponent>;

export const InfoBlock: Story = {
  args: {
    title: 'Rewards',
    children: '123,030,299 ISLM',
  },
};
