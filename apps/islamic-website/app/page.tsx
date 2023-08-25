import type { Metadata } from 'next';
import { IndexPage } from '@haqq/islamic-website/index-page';
import { getNewsPageContent } from '../utils/get-news-data';
import { getMembersContent } from '../utils/get-members-data';
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
  },
  metadataBase: new URL(DEPLOY_URL),
};

export default async function Page() {
  const news = await getNewsPageContent();
  const { advisoryMembers } = await getMembersContent();

  return (
    <IndexPage news={news.slice(0, 3)} advisoryMembers={advisoryMembers} />
  );
}
