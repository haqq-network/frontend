import type { Metadata } from 'next';
import { IndexPage } from '@haqq/islamic-website/index-page';
import { mapStorybookToNews } from '../utils/get-news-data';
import { DEPLOY_URL } from '../constants';
import { islamicOpenGraphImages } from './shared-metadata';
import { getHomePageContent } from '../utils/get-index-page-data';

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
  const { news, members, mainnet_accounts } = await getHomePageContent();
  const mappedNews = mapStorybookToNews(news);

  return (
    <IndexPage
      mainnetAccounts={mainnet_accounts}
      news={mappedNews}
      advisoryMembers={members.advisory_members}
      executiveMembers={members.executive_members}
      shariahMembers={members.shariah_members}
    />
  );
}
