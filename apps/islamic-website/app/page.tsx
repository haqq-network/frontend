import { IndexPage } from '@haqq/islamic-website/index-page';
import { getNewsPageContent } from '../utils/get-news-data';
import { getMembersContent } from '../utils/get-members-data';

export default async function Page() {
  const news = await getNewsPageContent();
  const { advisoryMembers } = await getMembersContent();

  return (
    <IndexPage news={news.slice(0, 3)} advisoryMembers={advisoryMembers} />
  );
}
