import type { Metadata } from 'next';
import { DubaiResidentDisclaimerPage } from '@haqq/islamic-website/dubai-residents-disclaimer-page';
import { DEPLOY_URL } from '../../../constants';
import { getDisclaimerContentFromFalconer } from '../../../utils/get-disclaimer';
import { islamicOpenGraphImages } from '../../shared-metadata';

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

export default async function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const disclaimer = await getDisclaimerContentFromFalconer(locale);

  return <DubaiResidentDisclaimerPage disclaimer={disclaimer} />;
}
