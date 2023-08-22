import { DEPLOY_URL } from '../../constants';
import { Metadata } from 'next';

export { WalletPage as default } from '@haqq/islamic-website/wallet-page';

export const metadata: Metadata = {
  title: 'IslamicCoin | Wallet',
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
