import type { Metadata } from 'next';
import { haqqOpenGraphImages } from '../../../shared-metadata';
import { DEPLOY_URL } from '../../../../constants';

const title = 'Event Scanner';
const description =
  'Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | HAQQ`,
    description,
    url: new URL('/events/scan', DEPLOY_URL).toString(),
    images: haqqOpenGraphImages,
  },
};

export { ScanPage as default } from '@haqq/haqq-website/events';
