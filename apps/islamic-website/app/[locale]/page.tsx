import type { Metadata } from 'next';
import { IndexPage } from '@haqq/islamic-website/index-page';
import { DEPLOY_URL } from '../../constants';
import { getHomePageContent } from '../../utils/get-index-page-data';
import { islamicOpenGraphImages } from '../shared-metadata';
import { getChainStatsFromFalconer } from '../../utils/get-chain-stats-data';

const title = 'IslamicCoin';
const description =
  'Your gateway to a Shariah-compliant decentralized world. Islamic Coin stands at the vanguard of ethical digital finance.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: islamicOpenGraphImages,
    locale: 'en',
    url: new URL(DEPLOY_URL).toString(),
    type: 'website',
  },
};

interface PageProps {
  params: { locale: string };
}

export default async function Page({ params: { locale } }: PageProps) {
  const stats = await getChainStatsFromFalconer();
  const { news, advisoryMembers, executiveMembers, shariahMembers } =
    await getHomePageContent(locale);

  return (
    <IndexPage
      stats={stats}
      news={news}
      advisoryMembers={advisoryMembers}
      executiveMembers={executiveMembers}
      shariahMembers={shariahMembers}
    />
  );
}
