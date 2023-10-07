import { storyblokInit, apiPlugin } from '@storyblok/js';
import {
  REVALIDATE_TIME,
  STORYBLOK_ACCESS_TOKEN,
  VERCEL_ENV,
} from '../constants';
import { cache } from 'react';

export const revalidate = REVALIDATE_TIME;

export const getFatwaContent = cache(async ({ locale }: { locale: string }) => {
  const { storyblokApi } = storyblokInit({
    accessToken: STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  });
  console.log({ locale }, 'GET FATWA CONTENT');

  if (!storyblokApi) {
    throw new Error('Failed to init storyblok');
  }

  const response = await storyblokApi.get('cdn/stories/fatwa', {
    version: VERCEL_ENV === 'production' ? 'published' : 'draft',
    language: locale,
  });

  return response.data.story.content.body as string;
});
