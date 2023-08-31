import { storyblokInit, apiPlugin } from '@storyblok/js';
import { NewsPost } from '@haqq/islamic-website-ui-kit';
import {
  REVALIDATE_TIME,
  STORYBLOK_ACCESS_TOKEN,
  VERCEL_ENV,
} from '../constants';
import { cache } from 'react';

interface StoryblokNewsPost {
  _uid: string;
  date: string;
  text: string;
  image: {
    filename: null | string;
  };
  title: string;
  main_url: string;
  content_type: 'PRESS' | 'VIDEO';
  main_url_text: string;
}

function mapStorybookToNews(data: StoryblokNewsPost[]): NewsPost[] {
  return data.map((post) => {
    const image =
      post.image.filename && post.image.filename !== ''
        ? {
            src: post.image.filename,
            width: Number(post.image.filename.split('/')[5].split('x')[0]),
            height: Number(post.image.filename.split('/')[5].split('x')[1]),
          }
        : null;

    return {
      image,
      title: post.title,
      description: post.text,
      date: new Date(post.date),
      source: post.main_url_text,
      type: post.content_type === 'PRESS' ? 'press' : 'events',
      url: post.main_url,
    };
  });
}

export const revalidate = REVALIDATE_TIME;

export const getNewsPageContent = cache(async () => {
  const { storyblokApi } = storyblokInit({
    accessToken: STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  });

  if (!storyblokApi) {
    throw new Error('Failed to init storyblok');
  }

  const response = await storyblokApi.get('cdn/stories/media', {
    version: VERCEL_ENV === 'production' ? 'published' : 'draft',
  });

  return mapStorybookToNews(response.data.story.content.body[0].columns);
});
