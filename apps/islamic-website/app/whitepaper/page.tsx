import { storyblokInit, apiPlugin } from '@storyblok/js';
import { WhitepaperPage } from '@haqq/islamic-website/whitepaper-page';

const STORYBLOK_ACCESS_TOKEN = process.env['STORYBLOK_ACCESS_TOKEN'];
const VERCEL_ENV = process.env['VERCEL_ENV'];

async function getWhitepaperContent() {
  const { storyblokApi } = storyblokInit({
    accessToken: STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  });

  if (!storyblokApi) {
    throw new Error('Failed to init storyblok');
  }

  const response = await storyblokApi.get('cdn/stories/wp', {
    version: VERCEL_ENV === 'production' ? 'published' : 'draft',
  });

  return response.data.story.content.body;
}

export const metadata = {
  title: 'IslamicCoin | Whitepaper',
};

export default async function Page() {
  const whitepaper = await getWhitepaperContent();

  return <WhitepaperPage whitepaper={whitepaper} />;
}
