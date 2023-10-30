import type { Metadata } from 'next';
import { haqqOpenGraphImages } from '../../shared-metadata';
import { DEPLOY_URL, ONRAMPER_API_KEY } from '../../../constants';
import { BuyPage } from '@haqq/haqq-website/buy-page';

const title = 'Buy';
const description = '';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | HAQQ`,
    description,
    url: new URL('/buy', DEPLOY_URL).toString(),
    images: haqqOpenGraphImages,
  },
};

export default async function Page() {
  const apiKey = ONRAMPER_API_KEY;

  return <BuyPage apiKey={apiKey as string} />;
}
