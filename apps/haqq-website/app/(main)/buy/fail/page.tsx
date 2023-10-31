import type { Metadata } from 'next';
import { haqqOpenGraphImages } from '../../../shared-metadata';
import { DEPLOY_URL } from '../../../../constants';

const title = 'Fail buy';
const description = '';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | HAQQ`,
    description,
    url: new URL('/buy/fail', DEPLOY_URL).toString(),
    images: haqqOpenGraphImages,
  },
};

export { FailBuyPage as default } from '@haqq/haqq-website/buy-page';
