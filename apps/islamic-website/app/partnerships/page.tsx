import { DEPLOY_URL } from '../../constants';
import type { Metadata } from 'next';
import { islamicOpenGraphImages } from '../shared-metadata';
// import { PartnershipPage } from '@haqq/islamic-website/partnership-page';
import { notFound } from 'next/navigation';

const title = 'Partnerships';
const description =
  "Collaborate with a pioneer in Shariah-compliant blockchain solutions. Let's redefine ethical finance together.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/partnerships', DEPLOY_URL).toString(),
  },
};

// export { PartnershipPage as default } from '@haqq/islamic-website/partnership-page';

export default async function Page() {
  // return <PartnershipPage />;
  notFound();
}
