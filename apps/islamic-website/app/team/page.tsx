import { DEPLOY_URL } from '../../constants';
import { Metadata } from 'next';

export { TeamPage as default } from '@haqq/islamic-website/team-page';

export const metadata: Metadata = {
  title: 'IslamicCoin | Team',
  description:
    'Get to know the dedicated individuals propelling Islamic Coin towards harmonizing Islamic finance with blockchain.',
  openGraph: {
    images: [{ url: '/opengraph-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/opengraph-image.png' }],
  },
  metadataBase: new URL(DEPLOY_URL),
};
