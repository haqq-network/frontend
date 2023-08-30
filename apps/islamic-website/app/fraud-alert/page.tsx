import { DEPLOY_URL } from '../../constants';
import type { Metadata } from 'next';

const title = 'IslamicCoin | Fraud alert';

export const metadata: Metadata = {
  title,
  openGraph: {
    title,
    images: [{ url: '/opengraph-image.png' }],
    locale: 'en-US',
    url: `${new URL(DEPLOY_URL)}build`,
    type: 'website',
  },
};

export { FraudPage as default } from '@haqq/islamic-website/fraud-page';
