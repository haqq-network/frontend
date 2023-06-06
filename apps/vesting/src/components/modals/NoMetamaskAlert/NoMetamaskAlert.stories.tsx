import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
  NoMetamaskAlert as NoMetamaskAlertComponent,
  NoMetamaskAlertProps,
} from './NoMetamaskAlert';

export default {
  title: 'ui-kit/Modals',
  component: NoMetamaskAlertComponent,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof NoMetamaskAlertComponent>;

const Template: ComponentStory<typeof NoMetamaskAlertComponent> = (
  args: NoMetamaskAlertProps,
) => {
  return <NoMetamaskAlertComponent {...args} />;
};

export const NoMetamaskAlert = Template.bind({});
NoMetamaskAlert.args = {
  isOpen: true,
};
