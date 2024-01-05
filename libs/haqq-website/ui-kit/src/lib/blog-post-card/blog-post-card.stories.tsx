import { BlogPostCard as BlogPostCardComponent } from './blog-post-card';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BlogPostCardComponent> = {
  component: BlogPostCardComponent,
  title: 'haqq-website/ui-kit/BlogPostCard',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof BlogPostCardComponent>;

export const BlogPostCardRegular: Story = {
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

export const BlogPostCardFeatured: Story = {
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
