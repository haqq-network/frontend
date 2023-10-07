import type { Metadata } from 'next';
import { IndexPage } from '@haqq/islamic-website/index-page';
import { mapStorybookToNews } from '../../utils/get-news-data';
import { getMembersContent } from '../../utils/get-members-data';
import { DEPLOY_URL } from '../../constants';
import { getHomePageContent } from '../../utils/get-index-page-data';

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
    locale: 'en',
    url: new URL(DEPLOY_URL).toString(),
    type: 'website',
  },
};

interface PageProps {
  params: { locale: string };
}

export default async function Page(props: PageProps) {
  const {
    params: { locale },
  } = props;
  console.log({ locale }, 'INDEX PAGE SERVER');

  const { advisoryMembers, executiveMembers, shariahMembers } =
    await getMembersContent({ locale });
  const {
    news,
    // commented until falconer supports localization
    // members: { advisory_members, executive_members, shariah_members },
    mainnet_accounts,
  } = await getHomePageContent();
  const mappedNews = mapStorybookToNews(news);

  return (
    <IndexPage
      locale={locale}
      mainnetAccounts={mainnet_accounts}
      news={mappedNews}
      advisoryMembers={advisoryMembers}
      executiveMembers={executiveMembers}
      shariahMembers={shariahMembers}
    />
  );
}
