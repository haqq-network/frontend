import { storyblokInit, apiPlugin } from '@storyblok/js';
import {
  REVALIDATE_TIME,
  STORYBLOK_ACCESS_TOKEN,
  VERCEL_ENV,
} from '../constants';
import { cache } from 'react';

export const revalidate = REVALIDATE_TIME;

export const getWhitepaperContent = cache(async () => {
  const { storyblokApi } = storyblokInit({
    accessToken: STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  });

  if (!storyblokApi) {
    throw new Error('Failed to init storyblok');
  }

  const response = await storyblokApi.get('cdn/stories/whitepaper', {
    version: VERCEL_ENV === 'production' ? 'published' : 'draft',
  });

  return response.data.story.content.body as string;
});
