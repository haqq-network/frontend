import type { Metadata } from 'next';
import { haqqOpenGraphImages } from '../../shared-metadata';
import { DEPLOY_URL, ONRAMPER_API_KEY } from '../../../constants';
import { BuyPage } from '@haqq/haqq-website/buy-page';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

const title = 'Buy ILSM';
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
  const headersList = headers();
  const appName = headersList.get('X-App-Name');
  console.log({ appName });

  const entries = [];
  for (const pair of headersList.entries()) {
    entries.push(`${pair[0]}: ${pair[1]}`);
  }

  console.log({ entries });

  if (!appName) {
    notFound();
  }

  return <BuyPage apiKey={ONRAMPER_API_KEY} />;
}
