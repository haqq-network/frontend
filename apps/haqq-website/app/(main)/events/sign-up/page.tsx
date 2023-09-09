import {
  DEPLOY_URL,
  NX_WALLETCONNECT_PROJECT_ID,
  VERCEL_ENV,
} from '../../../../constants';
import type { Metadata } from 'next';
import { haqqOpenGraphImages } from '../../../shared-metadata';
import dynamic from 'next/dynamic';

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

const SignUpPage = dynamic(
  async () => {
    const { QrRegistrationPage } = await import('@haqq/haqq-website/events');
    return { default: QrRegistrationPage };
  },
  {
    ssr: false,
    loading: () => {
      return <div className="min-h-[400px]"></div>;
    },
  },
);

export default function Page() {
  return (
    <SignUpPage
      walletConnectProjectId={NX_WALLETCONNECT_PROJECT_ID}
      isProduction={VERCEL_ENV === 'production'}
    />
  );
}
