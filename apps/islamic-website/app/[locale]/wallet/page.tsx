import type { Metadata } from 'next';
import { WalletPage as WalletPageComponent } from '@haqq/islamic-website/wallet-page';
import { DEPLOY_URL } from '../../../constants';
import { getWalletRatings } from '../../../utils/get-wallet-ratings';
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

export default async function WalletPage() {
  const storeRatings = await getWalletRatings();

  return <WalletPageComponent storeRatings={storeRatings} />;
}
