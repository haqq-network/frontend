import type { Meta, StoryObj } from '@storybook/react';
import { NewsCard as NewsCardComponent } from './news-card';

const meta: Meta<typeof NewsCardComponent> = {
  component: NewsCardComponent,
  title: 'islamic-website/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof NewsCardComponent>;

export const NewsCard: Story = {
  args: {
    post: {
      date: new Date(),
      title: 'News Title',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: {
        height: 300,
        width: 200,
        src: 'https://picsum.photos/200/300',
      },
      source: 'https://picsum.photos',
      type: 'type',
      url: 'https://picsum.photos',
    },
  },
};
