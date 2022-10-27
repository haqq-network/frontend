import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button, DangerButton } from './Button';

export default {
  component: Button,
  title: 'ui-kit/Button',
  parameters: {
    // layout: 'centered',
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;
const DangerTemplate: ComponentStory<typeof DangerButton> = (args) => (
  <DangerButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  children: 'Primary Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Secondary Button',
};

export const Disabled = Template.bind({});
Disabled.args = {
  outline: false,
  children: 'Disabled Button',
  disabled: true,
};

export const Outline = Template.bind({});
Outline.args = {
  outline: true,
  children: 'Outline Button',
};

export const OutlineDisabled = Template.bind({});
OutlineDisabled.args = {
  outline: true,
  children: 'Outline Disabled Button',
  disabled: true,
};

export const Danger = DangerTemplate.bind({});
Danger.args = {
  outline: false,
  children: 'Danger button',
  disabled: false,
};

export const DisabledDanger = DangerTemplate.bind({});
DisabledDanger.args = {
  outline: false,
  children: 'Disabled Danger button',
  disabled: true,
};

export const OutlineDanger = DangerTemplate.bind({});
OutlineDanger.args = {
  outline: true,
  children: 'Outline Danger button',
  disabled: false,
};

export const OutlineDisabledDanger = DangerTemplate.bind({});
OutlineDisabledDanger.args = {
  outline: true,
  children: 'Outline Disabled Danger button',
  disabled: true,
};
