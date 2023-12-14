import { FALCONER_ENDPOINT } from '../../constants';
import { FalconerRequestInit } from '../../types';
import { mapFalconerNews } from '../../utils/map-news';
import { FalconerMembers } from './get-members';
import { FalconerNewsPost } from './get-news';

export async function getIslamicHomePageData(
  options: Partial<FalconerRequestInit>,
  locale: string,
) {
  const requestUrl = new URL('/islamic/home', FALCONER_ENDPOINT);
  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ locale }),
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
