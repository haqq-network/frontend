import { IndexPage } from '@haqq/islamic-website/index-page';
import { getNewsPageContent } from '../utils/get-news-data';
import { getMembersContent } from '../utils/get-members-data';
import { REVALIDATE_TIME } from '../constants';

export const revalidate = REVALIDATE_TIME;

export default async function Page() {
  const news = await getNewsPageContent();
  const advisoryMembers = (await getMembersContent()).advisoryMembers;

  return (
    <IndexPage news={news.slice(0, 3)} advisoryMembers={advisoryMembers} />
  );
}
