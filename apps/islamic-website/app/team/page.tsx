import type { Metadata } from 'next';

const title = 'IslamicCoin | Team';
const description =
  'Get to know the dedicated individuals propelling Islamic Coin towards harmonizing Islamic finance with blockchain.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: '/opengraph-image.png' }],
  },
};

export { TeamPage as default } from '@haqq/islamic-website/team-page';
