import { Meta, StoryObj } from '@storybook/react';
import { SpinnerLoader as SpinnerLoaderComponent } from './spinner-loader';

const meta: Meta<typeof SpinnerLoaderComponent> = {
  component: SpinnerLoaderComponent,
  title: 'shell/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SpinnerLoaderComponent>;

export const SpinnerLoader: Story = {};
