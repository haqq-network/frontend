import { storyblokInit, apiPlugin } from '@storyblok/js';
import {
  REVALIDATE_TIME,
  STORYBLOK_ACCESS_TOKEN,
  VERCEL_ENV,
} from '../constants';
import { cache } from 'react';
import { Post } from '@haqq/haqq-website/blog';

export const revalidate = REVALIDATE_TIME;

export interface StoryblokPost {
  _uid: string;
  title: string;
  date: string;
  slug: string;
  description: string;
  image: {
    filename: null | string;
  };
  featured: boolean;
  published: boolean;
  content: string;
  tags: string[];
}

function mapStorybookToPosts(data: { posts: StoryblokPost[] }): Post[] {
  const posts = data.posts.map((post) => {
    if (!post.published) {
      return null;
    }

    const image =
      post.image.filename && post.image.filename !== ''
        ? {
            src: post.image.filename,
            width: Number(post.image.filename.split('/')[5].split('x')[0]),
            height: Number(post.image.filename.split('/')[5].split('x')[1]),
          }
        : null;

    return {
      id: post._uid,
      title: post.title,
      slug: post.slug,
      date: post.date,
      description: post.description ?? '',
      content: post.content ?? '',
      image,
      isFeatured: post.featured,
      tags: post.tags,
    } as Post;
  });
  const filteredPosts = posts.filter(Boolean) as Post[];
  const sortedPosts = filteredPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return sortedPosts;
}

export const getBlogPosts = cache(async () => {
  const { storyblokApi } = storyblokInit({
    accessToken: STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  });

  if (!storyblokApi) {
    throw new Error('Failed to init storyblok');
  }

  const response = await storyblokApi.get('cdn/stories/blog', {
    version: VERCEL_ENV === 'production' ? 'published' : 'draft',
  });

  const posts = mapStorybookToPosts(response.data.story.content);
  const tags = [];

  for (const post of posts) {
    tags.push(...post.tags);
  }

  return { posts, tags: [...new Set(tags)] };
});

export const getBlogPost = cache(async (slug: string) => {
  const { posts } = await getBlogPosts();

  return posts.find((post) => {
    return post.slug === slug;
  });
});
