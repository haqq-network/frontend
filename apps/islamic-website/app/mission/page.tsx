import { DEPLOY_URL } from '../../src/contansts';
import { Metadata } from 'next';

export { MissionPage as default } from '@haqq/islamic-website/mission-page';

export const metadata: Metadata = {
  title: 'IslamicCoin | Mission',
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
