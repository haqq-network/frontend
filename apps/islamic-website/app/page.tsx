import type { Metadata } from 'next';
import { IndexPage } from '@haqq/islamic-website/index-page';
import { getNewsPageContent } from '../utils/get-news-data';
import { getMembersContent } from '../utils/get-members-data';
import { getMainnetAccounts } from '../utils/get-mainnet-accounts-data';
import { DEPLOY_URL } from '../constants';

const title = 'IslamicCoin';
const description =
  'Your gateway to a Shariah-compliant decentralized world. Islamic Coin stands at the vanguard of ethical digital finance.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: '/opengraph-image.png' }],
    locale: 'en-US',
    url: new URL(DEPLOY_URL),
    type: 'website',
  },
};

export default async function Page() {
  const news = await getNewsPageContent();
  const { advisoryMembers, executiveMembers, shariahMembers } =
    await getMembersContent();
  const mainnetAccounts = await getMainnetAccounts(3476);

  return (
    <IndexPage
      mainnetAccounts={mainnetAccounts}
      news={news.slice(0, 3)}
      advisoryMembers={advisoryMembers}
      executiveMembers={executiveMembers}
      shariahMembers={shariahMembers}
    />
  );
}
