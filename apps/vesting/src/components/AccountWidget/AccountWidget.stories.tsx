import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AccountWidget as AccountWidgetComponent } from './AccountWidget';

export default {
  title: 'ui-kit/AccountWidget',
  component: AccountWidgetComponent,
} as ComponentMeta<typeof AccountWidgetComponent>;

const Template: ComponentStory<typeof AccountWidgetComponent> = (args: any) => {
  return <AccountWidgetComponent {...args} />;
};

export const Connected = Template.bind({});
Connected.args = {
  isConnected: true,
  address: '0x664B07EA8969d643B0aCc4829c113F6C20514F65',
  balance: 536531.712545123,
  symbol: 'islm',
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  ...Connected.args,
  isConnected: false,
};
