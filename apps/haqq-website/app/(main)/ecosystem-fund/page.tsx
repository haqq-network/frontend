import type { Metadata } from 'next';
import { DEPLOY_URL } from '../../../constants';
import { haqqOpenGraphImages } from '../../shared-metadata';

const title = 'Ecosystem fund';
const description =
  'Discover how you can participate in the HAQQ ecosystem as a builder of Shariah-compliant dApps by taking advantage of our grants.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | HAQQ`,
    description,
    url: new URL('/ecosystem-fund', DEPLOY_URL).toString(),
    images: haqqOpenGraphImages,
  },
};

export { EcosystemFundPage as default } from '@haqq/haqq-website/ecosystem-fund-page';
