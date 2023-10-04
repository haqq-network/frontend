import type { Metadata } from 'next';
import { IndexPage } from '@haqq/islamic-website/index-page';
import { getNewsPageContent } from '../utils/get-news-data';
import { getMembersContent } from '../utils/get-members-data';
// import { getMainnetAccounts } from '../utils/get-mainnet-accounts-data';
import { DEPLOY_URL } from '../constants';
import { islamicOpenGraphImages } from './shared-metadata';

const title = 'IslamicCoin';
const description =
  'Your gateway to a Shariah-compliant decentralized world. Islamic Coin stands at the vanguard of ethical digital finance.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    url: new URL(DEPLOY_URL).toString(),
    images: islamicOpenGraphImages,
  },
};

export default async function Page() {
  const news = await getNewsPageContent(3);
  const { advisoryMembers, executiveMembers, shariahMembers } =
    await getMembersContent();
  // const mainnetAccounts = await getMainnetAccounts(3476);

  return (
    <IndexPage
      mainnetAccounts={2504894}
      news={news}
      advisoryMembers={advisoryMembers}
      executiveMembers={executiveMembers}
      shariahMembers={shariahMembers}
    />
  );
}
