import type { Metadata } from 'next';
import { walletOpenGraphImages } from '../../shared-metadata';
import { DEPLOY_URL } from '../../../constants';

const title = 'Wallet';
const description =
  'Seamlessly manage your Shariah-compliant assets. Tailored for the discerning investor in the digital age.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: new URL('/wallet', DEPLOY_URL).toString(),
    images: walletOpenGraphImages,
  },
  appLinks: {
    ios: {
      url: 'https://apps.apple.com/app/haqq-wallet-by-bored-gen/id6443843352',
      app_store_id: 6443843352,
    },
    android: {
      package: 'com.haqq.wallet',
      url: 'https://play.google.com/store/apps/details?id=com.haqq.wallet',
    },
  },
};

export { WalletPage as default } from '@haqq/haqq-website/wallet-page';
