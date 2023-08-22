import { DEPLOY_URL } from '../../contansts';
import { Metadata } from 'next';

export { BuildPage as default } from '@haqq/islamic-website/build-page';

export const metadata: Metadata = {
  title: 'IslamicCoin | Build',
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
