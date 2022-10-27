import { ComponentStory } from '@storybook/react';
import {
  Heading as HeadingComponent,
  HeadingProps,
  Text as TextComponent,
  TextProps,
} from './Typography';

export default {
  title: 'ui-kit/Typography',
  parameters: {
    // layout: 'centered',
  },
  args: {
    children:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis inventore dolorum quas.',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'default', 'light', 'white'],
    },
  },
};

const HeadindTemplate: ComponentStory<typeof HeadingComponent> = (
  args: HeadingProps,
) => {
  return <HeadingComponent {...args} />;
};
const TextTemplate: ComponentStory<typeof TextComponent> = (
  args: TextProps,
) => {
  return <TextComponent {...args} />;
};

export const Heading = HeadindTemplate.bind({});
Heading.args = {
  level: 3,
  color: 'default',
};

export const Text = TextTemplate.bind({});
Text.args = {
  italic: false,
  underline: false,
  running: false,
  bold: false,
  block: false,
  color: 'default',
};

export const ItalicText = TextTemplate.bind({});
ItalicText.args = {
  italic: true,
};

export const BoldText = TextTemplate.bind({});
BoldText.args = {
  bold: true,
};
