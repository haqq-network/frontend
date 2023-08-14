import { Container, NewsProps, Text } from '@haqq/islamic-ui-kit';
import { FeaturedPostBlock } from '../featured-post-block/featured-post-block';
import { useMemo } from 'react';
import { PostsBlock } from '../posts-block/posts-block';
import { SubscribeForm } from '@haqq/islamic-website/forms';

const mockNews: NewsProps = [
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/200/300',
    },
    source: 'mockwebsite.com',
    type: 'events',
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
      src: 'https://picsum.photos/200/300',
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
      src: 'https://picsum.photos/200/300',
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
      src: 'https://picsum.photos/200/300',
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
      src: 'https://picsum.photos/200/300',
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
      src: 'https://picsum.photos/200/300',
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
      src: 'https://picsum.photos/200/300',
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
      src: 'https://picsum.photos/200/300',
    },
    source: 'mockwebsite.com',
    type: 'press',
    isFeatured: true,
  },
];

export function NewsPage() {
  const { featuredPost, postsToRender } = useMemo(() => {
    let featuredPost = undefined;
    const postsToRender = [];

    for (const post of mockNews) {
      if (!featuredPost) {
        if (post.isFeatured) {
          featuredPost = post;
        } else {
          postsToRender.push(post);
        }
      } else {
        postsToRender.push(post);
      }
    }

    return { featuredPost, postsToRender };
  }, []);

  return (
    <Container className="mt-[32px] flex flex-col pb-[60px] text-white md:mt-[52px] lg:mt-[68px]">
      <div className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
        Islamic Coin Press & News
      </div>
      <div className="mt-[32px] flex flex-col gap-[24px] lg:flex-row xl:w-3/4">
        <Text size="small" className="lg:w-1/2">
          Keep up to date with our upcoming Public Launch and Exchange listing -
          Subscribe to our newsletter
        </Text>
        <SubscribeForm
          className="flex flex-col gap-[16px] md:flex-row"
          inputClassName="md:min-w-[240px]"
        />
      </div>
      {featuredPost && (
        <FeaturedPostBlock
          post={featuredPost}
          className="mt-[60px] lg:mt-[140px]"
        />
      )}
      {postsToRender.length > 0 && (
        <PostsBlock posts={postsToRender} className="mt-[60px] lg:mt-[140px]" />
      )}
    </Container>
  );
}
