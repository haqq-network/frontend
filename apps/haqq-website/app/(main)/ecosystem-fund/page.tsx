import type { Metadata } from 'next';
import { haqqOpenGraphImages } from '../../shared-metadata';
import { DEPLOY_URL } from '../../../constants';

const title = 'Ecosystem fund';
const description =
  'Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance';

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
