import type { Metadata } from 'next';
import { WhitepaperPage } from '@haqq/islamic-website/whitepaper-page';
import { getWhitepaperContent } from '../../../utils/get-whitepaper-content';
import { DEPLOY_URL } from '../../../constants';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Whitepaper';
const description =
  'The blueprint for a harmonious meld of Islamic finance and blockchain. Delve deep into the vision and strategies steering HAQQ and Islamic Coin.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/whitepaper', DEPLOY_URL).toString(),
  },
};

export default async function Page({
  params: locale,
}: {
  params: { locale: string };
}) {
  const whitepaper = await getWhitepaperContent(locale);

  return <WhitepaperPage whitepaper={whitepaper} />;
}
