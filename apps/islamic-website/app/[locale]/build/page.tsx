import type { Metadata } from 'next';
import { DEPLOY_URL } from '../../../constants';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Build';
const description =
  'Content: Develop and innovate on a platform that brings Islamic financial traditions to the blockchain forefront.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/build', DEPLOY_URL).toString(),
  },
};

export { BuildPage as default } from '@haqq/islamic-website/build-page';
