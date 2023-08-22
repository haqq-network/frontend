import { DEPLOY_URL } from '../../constants';
import { Metadata } from 'next';

export { ValuesPage as default } from '@haqq/islamic-website/values-page';

export const metadata: Metadata = {
  title: 'IslamicCoin | Our Values',
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
