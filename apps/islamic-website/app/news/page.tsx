import { NewsPage } from '@haqq/islamic-website/news-page';
import { getNewsPageContent } from '../../utils/get-news-data';
import { REVALIDATE_TIME } from '../../constants';

export const revalidate = REVALIDATE_TIME;

export const metadata = {
  title: 'IslamicCoin | News',
  description:
    'Stay in the loop with the latest breakthroughs, announcements, and milestones from Islamic Coin.',
};

export default async function Page() {
  const news = await getNewsPageContent();
  return <NewsPage news={news} />;
}
