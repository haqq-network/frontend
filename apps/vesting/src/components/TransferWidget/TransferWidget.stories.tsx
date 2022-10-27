import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TransferWidget as TransferWidgetComponent } from './TransferWidget';

export default {
  title: 'ui-kit/Widgets',
  component: TransferWidgetComponent,
  // parameters: {
  //   layout: 'centered',
  // },
} as ComponentMeta<typeof TransferWidgetComponent>;

const Template: ComponentStory<typeof TransferWidgetComponent> = (
  args: any,
) => {
  return <TransferWidgetComponent {...args} />;
};

export const TransferWidget = Template.bind({});
TransferWidget.args = {};
