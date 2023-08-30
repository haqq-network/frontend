import type { Metadata } from 'next';
import { WhitepaperPage } from '@haqq/islamic-website/whitepaper-page';
import { getWhitepaperContent } from '../../utils/get-whitepaper-content';
import { DEPLOY_URL } from '../../constants';

const title = 'IslamicCoin | Whitepaper';
const description =
  'The blueprint for a harmonious meld of Islamic finance and blockchain. Delve deep into the vision and strategies steering HAQQ and Islamic Coin.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: '/opengraph-image.png' }],
    locale: 'en-US',
    url: `${new URL(DEPLOY_URL)}build`,
    type: 'website',
  },
};

export default async function Page() {
  const whitepaper = await getWhitepaperContent();

  return <WhitepaperPage whitepaper={whitepaper} />;
}
