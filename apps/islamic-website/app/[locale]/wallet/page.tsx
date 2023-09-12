import { DEPLOY_URL } from '../../../constants';
import type { Metadata } from 'next';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Wallet';
const description =
  'Seamlessly manage your Shariah-compliant assets. Tailored for the discerning investor in the digital age.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/wallet', DEPLOY_URL).toString(),
  },
};

export { WalletPage as default } from '@haqq/islamic-website/wallet-page';
