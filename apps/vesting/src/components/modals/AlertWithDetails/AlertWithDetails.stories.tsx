import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
  AlertWithDetails as AlertWithDetailsComponent,
  AlertWithDetailsProps,
} from './AlertWithDetails';

export default {
  title: 'ui-kit/Modals',
  component: AlertWithDetailsComponent,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof AlertWithDetailsComponent>;

const Template: ComponentStory<typeof AlertWithDetailsComponent> = (
  args: AlertWithDetailsProps,
) => <AlertWithDetailsComponent {...args} />;

export const AlertWithDetails = Template.bind({});
AlertWithDetails.args = {
  isOpen: true,
  title: 'Alert with details',
  message: 'Example alert message',
  details:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum perspiciatis pariatur praesentium possimus exercitationem blanditiis atque laborum, fuga dolorum ab odit aut minima, dolor doloribus delectus voluptas minus aspernatur cumque?',
};
