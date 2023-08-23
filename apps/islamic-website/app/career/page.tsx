import { DEPLOY_URL } from '../../constants';
import { Metadata } from 'next';

export { CareerPage as default } from '@haqq/islamic-website/career-page';

export const metadata: Metadata = {
  title: 'IslamicCoin | Career',
  description:
    'Join a team bridging Islamic finance and cutting-edge blockchain technology. Shape the future with us.',
  openGraph: {
    images: [{ url: '/opengraph-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/opengraph-image.png' }],
  },
  metadataBase: new URL(DEPLOY_URL),
};
