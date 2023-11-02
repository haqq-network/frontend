import { FALCONER_ENDPOINT } from '../constants';
import { FalconerChainStatsRequestInit } from '../get-chain-stats/get-chain-stats';

export interface Member {
  image: string;
  title: string;
  description: string;
  url?: string;
  role?: string;
}

export async function getMembersData(
  options: Partial<FalconerChainStatsRequestInit>,
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
    throw new Error('chain stats fetch failed');
  }

  const { members } = await response.json();

  return {
    advisoryMembers: members.advisory_members,
    executiveMembers: members.executive_members,
    shariahMembers: members.shariah_members,
    teamMembers: members.team_members,
    founderMembers: members.founder_members,
  };
}
