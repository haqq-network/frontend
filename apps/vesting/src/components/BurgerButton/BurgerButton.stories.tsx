import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BurgerButton as BurgerButtonComponent } from './BurgerButton';

export default {
  title: 'ui-kit/Button',
  component: BurgerButtonComponent,
  // parameters: {
  //   layout: 'centered',
  // },
} as ComponentMeta<typeof BurgerButtonComponent>;

const Template: ComponentStory<typeof BurgerButtonComponent> = (args: any) => {
  return <BurgerButtonComponent {...args} />;
};

export const BurgerButtonOpened = Template.bind({});
BurgerButtonOpened.args = {
  isOpen: true,
};
