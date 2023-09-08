import { QrRegistrationPage } from '@haqq/haqq-website/events';
import {
  DEPLOY_URL,
  NX_WALLETCONNECT_PROJECT_ID,
  VERCEL_ENV,
} from '../../../../constants';
import type { Metadata } from 'next';
import { haqqOpenGraphImages } from '../../../shared-metadata';

const title = 'Event Registration';
const description =
  'Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | HAQQ`,
    description,
    url: new URL('/events/sign-up', DEPLOY_URL).toString(),
    images: haqqOpenGraphImages,
  },
};

export default function Page() {
  return (
    <QrRegistrationPage
      walletConnectProjectId={NX_WALLETCONNECT_PROJECT_ID}
      isProduction={VERCEL_ENV === 'production'}
    />
  );
}
