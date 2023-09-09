import type { Metadata } from 'next';
import { haqqOpenGraphImages } from '../../shared-metadata';
import { DEPLOY_URL } from '../../../constants';

const title = 'Ecosystem fund';
const description =
  'Discover how you can participate in the HAQQ ecosystem as a builder of Shariah-compliant dApps by taking advantage of our grants.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: new URL('/ecosystem-fund', DEPLOY_URL).toString(),
    images: haqqOpenGraphImages,
  },
};

export { EcosystemFundPage as default } from '@haqq/haqq-website/ecosystem-fund-page';
