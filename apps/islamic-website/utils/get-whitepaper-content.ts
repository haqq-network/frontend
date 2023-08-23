import { storyblokInit, apiPlugin } from '@storyblok/js';
import { STORYBLOK_ACCESS_TOKEN, VERCEL_ENV } from '../constants';

export async function getWhitepaperContent() {
  const { storyblokApi } = storyblokInit({
    accessToken: STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  });

  if (!storyblokApi) {
    throw new Error('Failed to init storyblok');
  }

  const response = await storyblokApi.get('cdn/stories/updatedwhitepaper', {
    version: VERCEL_ENV === 'production' ? 'published' : 'draft',
  });

  return response.data.story.content.body;
}
