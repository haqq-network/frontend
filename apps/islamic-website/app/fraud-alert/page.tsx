import { DEPLOY_URL } from '../../constants';
import type { Metadata } from 'next';

const title = 'IslamicCoin | Recruitment Fraud Alert';
const description =
  ' Learn how to identify and protect yourself against recruitment scams claiming to be from Islamic Coin. Know the red flags and stay secure in your job search.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: '/opengraph-image.png' }],
    locale: 'en-US',
    url: `${new URL(DEPLOY_URL)}build`,
    type: 'website',
  },
};

export { FraudPage as default } from '@haqq/islamic-website/fraud-page';
