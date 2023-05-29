import { NewsCard as NewsCardComponent } from './news-card';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof NewsCardComponent> = {
  component: NewsCardComponent,
  title: 'shell/ui-kit/news-card',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof NewsCardComponent>;

export const NewsCardRegular: Story = {
  args: {
    category: 'news',
    date: 'May 26 2023',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    imageUrl: '/assets/test.png',
    title: 'Post 1',
    id: '1',
  },
};

export const NewsCardFeatured: Story = {
  args: {
    category: 'news',
    date: 'May 26 2023',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    imageUrl: '/assets/test.png',
    title: 'Post 1',
    id: '1',
    isFeatured: true,
  },
};
