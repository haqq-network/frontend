import { FalconerMembers } from './get-islamic-members';
import { FalconerNewsPost } from './get-islamic-news';
import { FALCONER_ENDPOINT, FalconerRequestInit } from '../../constants';
import { mapFalconerNews } from '../../utils/map-news';

export async function getIslamicHomePageData(
  options: Partial<FalconerRequestInit>,
  locale: string,
) {
  const requestUrl = new URL('/islamic/home', FALCONER_ENDPOINT);

  requestUrl.searchParams.append('locale', locale);

  const response = await fetch(requestUrl, {
    method: 'GET',
    ...options,
  });

  if (!response.ok) {
    throw new Error('Homepage data fetch failed');
  }

  const responseJson: {
    members: FalconerMembers;
    news: FalconerNewsPost[];
  } = await response.json();

  return {
    news: mapFalconerNews(responseJson.news),
    advisoryMembers: responseJson.members.advisory_members,
    executiveMembers: responseJson.members.executive_members,
    shariahMembers: responseJson.members.shariah_members,
  };
}
