import { Metadata } from 'next';
import { DEPLOY_URL } from '../../src/contansts';

export { AcademyPage as default } from '@haqq/islamic-website/academy-page';

export const metadata: Metadata = {
  title: 'IslamicCoin | Academy',
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
