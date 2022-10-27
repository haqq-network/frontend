import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { WithdrawWidget as WithdrawWidgetComponent } from './WithdrawWidget';

export default {
  title: 'ui-kit/Widgets',
  component: WithdrawWidgetComponent,
  // parameters: {
  //   layout: 'centered',
  // },
} as ComponentMeta<typeof WithdrawWidgetComponent>;

const Template: ComponentStory<typeof WithdrawWidgetComponent> = (
  args: any,
) => {
  return <WithdrawWidgetComponent {...args} />;
};

export const WithdrawWidget = Template.bind({});
WithdrawWidget.args = {};
