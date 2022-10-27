import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Tooltip } from './Tooltip';

export default {
  title: 'ui-kit/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args: any) => {
  return <Tooltip {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  children: 'Hover me',
  text: 'Example tooltip message',
};
