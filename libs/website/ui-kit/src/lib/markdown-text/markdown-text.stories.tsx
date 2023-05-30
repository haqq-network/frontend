import { MarkdownText as MarkdownTextComponent } from './markdown-text';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof MarkdownTextComponent> = {
  component: MarkdownTextComponent,
  title: 'website/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof MarkdownTextComponent>;

export const MarkdownText: Story = {
  args: {
    children:
      '## Our vision – synthesis of ideology, technology, and community\n\n## Islam\n\nIslam is the world’s second-largest religion with almost 2 billion followers — a quarter of the world’s population. Muslims make up a majority of the population in 47 countries. Islam teaches that God is merciful, all-powerful, and unique.\n\nIslamic law, or Shariah law, is a religious law forming part of the Islamic tradition. It guides and dictates many aspects in the lives of Muslims throughout the world, including financial interactions.\n\nOne of the core principles of Islamic financial law is the prohibition of paying or charging interest, which is currently not followed by a large part of financial institutions constituting the modern financial system.\n\nAccording to the [Duck Duck Go](https://duckduckgo.com), the volume of the Islamic financial sector was $2.88 trillion in 2020 and is expected to grow to $3.69 trillion by 2024. According to the same report, two of the four main factors influencing the expansion, as well as the Islamic economy in particular, are the rapidly growing Muslim population, the spread of digital technologies, and mobile communications.\n\nThe Islamic financial system has been virtually untouched by the recent financial crisis due to its prohibitions on speculative transactions and uncertainty, as well as the attention it pays to fairness and risk-sharing. Islamic finance is a rare example, where the system featuring certain limitations and restrictions is more sustainable and powerful, compared to the system where such limitations are not present.\n\n##',
    className:
      'prose prose-base max-w-none text-white text-[13px] leading-[20px] md:text-[15px] md:leading-[24px] lg:text-[16px] lg:leading-[26px] prose-a:text-haqq-orange prose-a:no-underline hover:prose-a:text-[#FF8D69] prose-a:transition-colors prose-a:duration-300 prose-a:ease-out prose-headings:text-white prose-strong:text-white marker:prose-li:text-white',
  },
};
