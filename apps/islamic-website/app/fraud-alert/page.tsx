import type { Metadata } from 'next';

const title = 'IslamicCoin | Fraud alert';

export const metadata: Metadata = {
  title,
  openGraph: {
    title,
    images: [{ url: '/opengraph-image.png' }],
  },
};

export { FraudPage as default } from '@haqq/islamic-website/fraud-page';
