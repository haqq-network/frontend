import { Checkbox as CheckboxComponent } from './checkbox';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CheckboxComponent> = {
  component: CheckboxComponent,
  title: 'shell/ui-kit/checkbox',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxComponent>;

export const Default: Story = {
  args: {
    children: 'Show Inactive',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Show Inactive',
    disabled: true,
  },
};
