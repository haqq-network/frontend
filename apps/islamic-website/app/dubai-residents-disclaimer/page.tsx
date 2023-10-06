import type { Metadata } from 'next';
import { DubaiResidentDisclaimerPage } from '@haqq/islamic-website/dubai-residents-disclaimer-page';
import { DEPLOY_URL } from '../../constants';
import { islamicOpenGraphImages } from '../shared-metadata';
import { getDisclaimerContent } from '../../utils/get-disclaimer-data';

const title = 'Dubai Residents Disclaimer';
const description = '';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/dubai-residents-disclaimer', DEPLOY_URL).toString(),
  },
};

export default async function Page() {
  const disclaimer = await getDisclaimerContent();

  return <DubaiResidentDisclaimerPage disclaimer={disclaimer} />;
}
