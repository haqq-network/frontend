import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IslamicCoin | Not Found',
  openGraph: {
    title: 'IslamicCoin | Not Found',
    images: [{ url: '/opengraph-image.png' }],
  },
};

export { NotFound as default } from '@haqq/islamic-website/not-found-page';
