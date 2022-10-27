import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DepositStatsWidget as DepositStatsWidgetComponent } from './DepositStatsWidget';

export default {
  title: 'ui-kit/Widgets',
  component: DepositStatsWidgetComponent,
  // parameters: {
  //   layout: 'fullscreen',
  // },
} as ComponentMeta<typeof DepositStatsWidgetComponent>;

const Template: ComponentStory<typeof DepositStatsWidgetComponent> = (
  args: any,
) => {
  return <DepositStatsWidgetComponent {...args} />;
};

export const DepositStatsWidget = Template.bind({});
DepositStatsWidget.args = {};
