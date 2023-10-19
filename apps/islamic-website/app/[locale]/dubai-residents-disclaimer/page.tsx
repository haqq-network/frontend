import type { Metadata } from 'next';
import { DubaiResidentDisclaimerPage } from '@haqq/islamic-website/dubai-residents-disclaimer-page';
import { DEPLOY_URL } from '../../../constants';
import { islamicOpenGraphImages } from '../../shared-metadata';
import { getDisclaimerContent } from '../../../utils/get-disclaimer-data';

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

interface PageProps {
  params: { locale: string };
}

export default async function Page(props: PageProps) {
  const {
    params: { locale },
  } = props;
  const disclaimer = await getDisclaimerContent(locale);

  return <DubaiResidentDisclaimerPage disclaimer={disclaimer} />;
}
