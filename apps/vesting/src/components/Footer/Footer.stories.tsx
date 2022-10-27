import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Footer } from './Footer';

export default {
  component: Footer,
  title: 'ui-kit/Footer',
  parameters: {
    // layout: 'centered',
  },
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = () => <Footer />;

export const Primary = Template.bind({});
Primary.args = {};
