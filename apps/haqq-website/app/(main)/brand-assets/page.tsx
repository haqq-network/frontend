import type { Metadata } from 'next';
import { haqqOpenGraphImages } from '../../shared-metadata';
import { DEPLOY_URL } from '../../../constants';

const title = 'Brand assets';
const description = `Download HAQQ Network's official brand assets to represent our ethical and Shariah-compliant vision.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | HAQQ`,
    description,
    url: new URL('/brand-assets', DEPLOY_URL).toString(),
    images: haqqOpenGraphImages,
  },
};

export { BrandAssetsPage as default } from '@haqq/haqq-website/brand-assets-page';
