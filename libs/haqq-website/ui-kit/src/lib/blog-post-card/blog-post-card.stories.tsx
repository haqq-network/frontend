import { NewsCard as NewsCardComponent } from './blog-post-card';
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
    date: new Date('2021-05-01T00:00:00.000Z'),
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/200/300',
    },
    title: 'Post 1',
    isFeatured: false,
    tags: ['technology', 'news'],
  },
};

export const NewsCardFeatured: Story = {
  args: {
    date: new Date('2021-05-01T00:00:00.000Z'),
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/200/300',
    },
    title: 'Post 1',
    isFeatured: true,
    tags: ['technology', 'news'],
  },
};
