import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { DEPLOY_URL } from '../../../../constants';
import { haqqOpenGraphImages } from '../../../shared-metadata';

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

const ScanPage = dynamic(
  async () => {
    const { ScanPage } = await import('@haqq/haqq-website/events');
    return { default: ScanPage };
  },
  {
    ssr: false,
    loading: () => {
      return <div className="min-h-[400px]"></div>;
    },
  },
);

export default function Page() {
  return <ScanPage />;
}
