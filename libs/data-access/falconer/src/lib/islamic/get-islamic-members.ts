import { FALCONER_ENDPOINT, FalconerRequestInit } from '../../constants';

export interface Member {
  image: string;
  title: string;
  description: string;
  url?: string;
  role?: string;
}

export interface FalconerMembers {
  advisory_members: Member[];
  executive_members: Member[];
  shariah_members: Member[];
  team_members: Member[];
  founder_members: Member[];
}

export async function getIslamicMembersData(
  options: Partial<FalconerRequestInit>,
  locale: string,
) {
  const requestUrl = new URL('/islamic/members', FALCONER_ENDPOINT);

  requestUrl.searchParams.append('locale', locale);

  const response = await fetch(requestUrl, {
    method: 'GET',
    ...options,
  });

  if (!response.ok) {
    throw new Error('Members fetch failed');
  }

  const responseJson: { members: FalconerMembers } = await response.json();

  return {
    advisoryMembers: responseJson.members.advisory_members,
    executiveMembers: responseJson.members.executive_members,
    shariahMembers: responseJson.members.shariah_members,
    teamMembers: responseJson.members.team_members,
    founderMembers: responseJson.members.founder_members,
  };
}
