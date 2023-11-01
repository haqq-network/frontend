import { FALCONER_ENDPOINT } from '../constants';
import { FalconerChainStatsRequestInit } from '../get-chain-stats/get-chain-stats';

export interface Member {
  image: string;
  title: string;
  description: string;
  url?: string;
  role?: string;
}

export interface FalconerMembers {
  members: {
    advisoryMembers: Member[];
    executiveMembers: Member[];
    shariahMembers: Member[];
    teamMembers: Member[];
    founderMembers: Member[];
  };
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

  const responseJson = await response.json();

  return responseJson as FalconerMembers;
}
