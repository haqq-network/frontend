import type { Meta, StoryObj } from '@storybook/react';

import { MemberCard as MemberCardComponent } from './member-card';

const meta: Meta<typeof MemberCardComponent> = {
  component: MemberCardComponent,
  title: 'islamic-website/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof MemberCardComponent>;

export const MemberCard: Story = {
  args: {
    image: '',
    title: 'Sheikh Dr. Nizam Mohammed Saleh Yaquby',
    url: 'google.com',
  },
};
