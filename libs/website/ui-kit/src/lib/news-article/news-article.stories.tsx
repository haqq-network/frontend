import { NewsArticle as NewsArticleComponent } from './news-article';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof NewsArticleComponent> = {
  component: NewsArticleComponent,
  title: 'website/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof NewsArticleComponent>;

export const NewsArticle: Story = {
  args: {
    category: 'news',
    title: 'Haqq Finance is now live on BSC!',
    date: new Date('2021-05-01T00:00:00.000Z'),
    content:
      '## Our vision – synthesis of ideology, technology, and community\n\n## Islam\n\nIslam is the world’s second-largest religion with almost 2 billion followers — a quarter of the world’s population. Muslims make up a majority of the population in 47 countries. Islam teaches that God is merciful, all-powerful, and unique.\n\nIslamic law, or Shariah law, is a religious law forming part of the Islamic tradition. It guides and dictates many aspects in the lives of Muslims throughout the world, including financial interactions.\n\nOne of the core principles of Islamic financial law is the prohibition of paying or charging interest, which is currently not followed by a large part of financial institutions constituting the modern financial system.\n\nAccording to the [Duck Duck Go](https://duckduckgo.com), the volume of the Islamic financial sector was $2.88 trillion in 2020 and is expected to grow to $3.69 trillion by 2024. According to the same report, two of the four main factors influencing the expansion, as well as the Islamic economy in particular, are the rapidly growing Muslim population, the spread of digital technologies, and mobile communications.\n\nThe Islamic financial system has been virtually untouched by the recent financial crisis due to its prohibitions on speculative transactions and uncertainty, as well as the attention it pays to fairness and risk-sharing. Islamic finance is a rare example, where the system featuring certain limitations and restrictions is more sustainable and powerful, compared to the system where such limitations are not present.\n\n##',
    imageUrl: 'https://picsum.photos/1920/1080',
  },
};
