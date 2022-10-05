import React from 'react';
import { ComponentStory } from '@storybook/react';
import { Checkbox, CheckboxProps } from './checkbox';

export default {
  title: 'ui-kit/Checkbox',
  parameters: {
    layout: 'centered',
  },
};

const Template: ComponentStory<typeof Checkbox> = (args: CheckboxProps) => {
  return <Checkbox {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  children: 'Default Checkbox',
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Disabled Checkbox',
  disabled: true,
};
