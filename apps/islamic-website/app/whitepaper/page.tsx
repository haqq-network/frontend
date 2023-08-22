import { WhitepaperPage } from '@haqq/islamic-website/whitepaper-page';
import { DEPLOY_URL, REVALIDATE_TIME } from '../../constants';
import { Metadata } from 'next';
import { getWhitepaperContent } from '../../utils/get-whitepaper-content';

export const revalidate = REVALIDATE_TIME;

export const metadata: Metadata = {
  title: 'IslamicCoin | Whitepaper',
  description: '',
  openGraph: {
    images: [{ url: '/opengraph-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/opengraph-image.png' }],
  },
  metadataBase: new URL(DEPLOY_URL),
};

export default async function Page() {
  const whitepaper = await getWhitepaperContent();

  return <WhitepaperPage whitepaper={whitepaper} />;
}
