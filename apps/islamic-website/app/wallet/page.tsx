import { DEPLOY_URL } from '../../constants';
import type { Metadata } from 'next';

const title = 'IslamicCoin | Wallet';
const description =
  'Seamlessly manage your Shariah-compliant assets. Tailored for the discerning investor in the digital age.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: '/opengraph-image.png' }],
    locale: 'en-US',
    url: `${new URL(DEPLOY_URL)}wallet`,
    type: 'website',
  },
};

export { WalletPage as default } from '@haqq/islamic-website/wallet-page';
