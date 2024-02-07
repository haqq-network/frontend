import type { Metadata } from 'next';
import { DEPLOY_URL } from '../../../constants';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Scam Alert';
const description =
  'Learn how to identify and protect yourself against scams claiming to be from Islamic Coin. Know the red flags and stay secure in your job search.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/scam-alert', DEPLOY_URL).toString(),
  },
};

export { ScamAlertPage as default } from '@haqq/islamic-website/alerts-pages';
