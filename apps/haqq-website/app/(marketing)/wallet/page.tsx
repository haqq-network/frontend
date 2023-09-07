import type { Metadata } from 'next';

const title = 'HAQQ | Wallet';
const description =
  'The best way to hold Islamic Coin and remain Shariah-compliant along the way!';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
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
