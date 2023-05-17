import { ComponentStory, ComponentMeta } from '@storybook/react';
import { IdentIcon, IdentIconProps } from './IdentIcon';

export default {
  title: 'ui-kit-web3/IdentIcon',
  component: IdentIcon,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof IdentIcon>;

const Template: ComponentStory<typeof IdentIcon> = (args: IdentIconProps) => {
  return <IdentIcon {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  address: '0xD090340493b9A23D2E695d2745BA7D7a4e8f836b',
  size: 128,
};
