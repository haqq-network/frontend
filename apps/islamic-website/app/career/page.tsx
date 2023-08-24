import type { Metadata } from 'next';

const title = 'IslamicCoin | Career';
const description =
  'Join a team bridging Islamic finance and cutting-edge blockchain technology. Shape the future with us.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: '/opengraph-image.png' }],
  },
};

export { CareerPage as default } from '@haqq/islamic-website/career-page';
