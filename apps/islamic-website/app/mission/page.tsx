import { DEPLOY_URL } from '../../constants';
import { Metadata } from 'next';

export { MissionPage as default } from '@haqq/islamic-website/mission-page';

export const metadata: Metadata = {
  title: 'IslamicCoin | Mission',
  description:
    'On a mission to onboard the global Muslim community to digital finance without compromising Islamic values.',
  openGraph: {
    images: [{ url: '/opengraph-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/opengraph-image.png' }],
  },
  metadataBase: new URL(DEPLOY_URL),
};
