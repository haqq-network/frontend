import { NewsPage } from '@haqq/islamic-website/news-page';
import { getNewsPageContent } from '../../utils/get-news-data';

export const metadata = {
  title: 'IslamicCoin | News',
};

export default async function Page() {
  const news = await getNewsPageContent();
  return <NewsPage news={news} />;
}
