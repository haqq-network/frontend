import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ValidatorInfo } from './validator-info';

const Story: ComponentMeta<typeof ValidatorInfo> = {
  component: ValidatorInfo,
  title: 'ValidatorInfo',
};
export default Story;

const Template: ComponentStory<typeof ValidatorInfo> = (args) => (
  <ValidatorInfo {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
