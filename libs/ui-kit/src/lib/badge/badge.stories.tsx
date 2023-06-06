import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Badge } from './badge';

const Story: ComponentMeta<typeof Badge> = {
  component: Badge,
  title: 'ui-kit/Badge',
  parameters: {
    layout: 'centered',
  },
};
export default Story;

const Template: ComponentStory<typeof Badge> = (args) => {
  return <Badge {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  children: 'Badge text',
};
