import type { Metadata } from 'next';
import { haqqOpenGraphImages } from '../../../shared-metadata';
import { DEPLOY_URL } from '../../../../constants';

const title = 'Success buy';
const description = '';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | HAQQ`,
    description,
    url: new URL('/buy/success', DEPLOY_URL).toString(),
    images: haqqOpenGraphImages,
  },
};

export { SuccessBuyPage as default } from '@haqq/haqq-website/buy-page';
