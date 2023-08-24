import { WhitepaperPage } from '@haqq/islamic-website/whitepaper-page';
import { DEPLOY_URL } from '../../constants';
import { Metadata } from 'next';
import { getWhitepaperContent } from '../../utils/get-whitepaper-content';

export const metadata: Metadata = {
  title: 'IslamicCoin | Whitepaper',
  description:
    'The blueprint for a harmonious meld of Islamic finance and blockchain. Delve deep into the vision and strategies steering HAQQ and Islamic Coin.',
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
