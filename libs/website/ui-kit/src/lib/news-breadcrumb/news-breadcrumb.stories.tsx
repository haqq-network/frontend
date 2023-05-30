import { NewsBreadcrumb as NewsBreadcrumbComponent } from './news-breadcrumb';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof NewsBreadcrumbComponent> = {
  component: NewsBreadcrumbComponent,
  title: 'website/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof NewsBreadcrumbComponent>;

export const NewsBreadcrumb: Story = {
  args: {
    title: 'lorem ipsum dolor sit amet',
  },
};
