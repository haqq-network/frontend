import { NewsPage as NewsPageComponent } from '@haqq/islamic-website/news-page';
import { NewsPost } from '@haqq/islamic-ui-kit';

const mockNews: NewsPost[] = [
  {
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/id/1/200/300',
    },
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    date: new Date(),
    source: 'mockwebsite.com',
    type: 'events',
  },
  {
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/id/2/200/300',
    },
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    date: new Date(),
    source: 'mockwebsite.com',
    type: 'press',
  },
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/id/3/200/300',
    },
    source: 'mockwebsite.com',
    type: 'press',
  },
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/id/4/200/300',
    },
    source: 'mockwebsite.com',
    type: 'press',
  },
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/id/5/200/300',
    },
    source: 'mockwebsite.com',
    type: 'press',
  },
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/id/6/200/300',
    },
    source: 'mockwebsite.com',
    type: 'press',
  },
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/id/7/200/300',
    },
    source: 'mockwebsite.com',
    type: 'press',
    isFeatured: true,
  },
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/id/8/200/300',
    },
    source: 'mockwebsite.com',
    type: 'press',
    isFeatured: true,
  },
];

export default function NewsPage() {
  return <NewsPageComponent news={mockNews} />;
}
