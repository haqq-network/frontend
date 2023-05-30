import { NewsCard as NewsCardComponent } from './news-card';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof NewsCardComponent> = {
  component: NewsCardComponent,
  title: 'website/ui-kit/news-card',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof NewsCardComponent>;

export const NewsCardRegular: Story = {
  args: {
    category: 'news',
    date: new Date('2021-05-01T00:00:00.000Z'),
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    imageUrl: 'https://picsum.photos/200/300',
    title: 'Post 1',
    id: '1',
  },
};

export const NewsCardFeatured: Story = {
  args: {
    category: 'news',
    date: new Date('2021-05-01T00:00:00.000Z'),
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    imageUrl: 'https://picsum.photos/200/300',
    title: 'Post 1',
    id: '1',
    isFeatured: true,
  },
};
