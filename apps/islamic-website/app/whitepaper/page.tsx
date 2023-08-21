import { storyblokInit, apiPlugin } from '@storyblok/js';
import { WhitepaperPage } from '@haqq/islamic-website/whitepaper-page';
import { DEPLOY_URL } from '../../src/contansts';
import { Metadata } from 'next';

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

export const metadata: Metadata = {
  title: 'IslamicCoin | Whitepaper',
  description: '',
  openGraph: {
    images: [{ url: '/opengraph-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/opengraph-image.png' }],
  },
  metadataBase: new URL(DEPLOY_URL),
};

export default async function Page() {
  const whitepaper = await getWhitepaperContent();

  return <WhitepaperPage whitepaper={whitepaper} />;
}
