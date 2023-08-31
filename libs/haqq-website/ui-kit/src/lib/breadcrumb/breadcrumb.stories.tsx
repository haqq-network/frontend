import { Breadcrumb as BreadcrumbComponent } from './breadcrumb';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BreadcrumbComponent> = {
  component: BreadcrumbComponent,
  title: 'website/ui-kit',
};

export default meta;

type Story = StoryObj<typeof BreadcrumbComponent>;

export const Breadcrumb: Story = {
  args: {
    title: 'lorem ipsum dolor sit amet',
  },
};
