import { FALCONER_ENDPOINT } from '../../constants';
import { FalconerRequestInit } from '../../types';

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
  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ locale }),
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
