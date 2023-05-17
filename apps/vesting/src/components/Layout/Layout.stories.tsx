import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Header as HeaderComponent } from '../Header/Header';

export default {
  title: 'ui-kit/Layout',
  component: HeaderComponent,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof HeaderComponent>;

const Template: ComponentStory<typeof HeaderComponent> = (args: any) => {
  return <HeaderComponent {...args} />;
};

export const Header = Template.bind({});
Header.args = {};
