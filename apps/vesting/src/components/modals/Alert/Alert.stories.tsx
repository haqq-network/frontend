import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Alert as AlertComponent, AlertProps } from './Alert';
import { Confirm as ConfirmComponent, ConfirmProps } from '../Confirm/Confirm';
import { Text } from '../../Typography/Typography';

export default {
  title: 'ui-kit/Modals',
  component: AlertComponent,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof AlertComponent>;

const Template: ComponentStory<typeof AlertComponent> = (args: AlertProps) => (
  <AlertComponent {...args} />
);

const ConfirmTemplate: ComponentStory<typeof ConfirmComponent> = (
  args: ConfirmProps,
) => <ConfirmComponent {...args} />;

export const Alert = Template.bind({});
Alert.args = {
  isOpen: true,
  title: 'Example alert',
  children:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum perspiciatis pariatur praesentium possimus exercitationem blanditiis atque laborum, fuga dolorum ab odit aut minima, dolor doloribus delectus voluptas minus aspernatur cumque?',
};

export const Confirm = ConfirmTemplate.bind({});
Confirm.args = {
  isOpen: true,
  title: 'Example alert',
  children:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum perspiciatis pariatur praesentium possimus exercitationem blanditiis atque laborum, fuga dolorum ab odit aut minima, dolor doloribus delectus voluptas minus aspernatur cumque?',
  buttonTitle: 'Confirm',
};

export const WithdrawAlert = Template.bind({});
WithdrawAlert.args = {
  isOpen: true,
  title: 'Withdraw alert',
  children: (
    <div className="flex flex-col">
      <div>
        <Text>2.0 ISLM</Text> have been withdrawn on your account
      </div>
      <Text className="my-[2px]">Your transaction is</Text>
      <Text bold>
        0xb4bc263278d3f77a652a8d73a6bfd8ec0ba1a63923bbb4f38147fb8a943da26d
      </Text>
    </div>
  ),
};
