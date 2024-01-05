import { FALCONER_ENDPOINT } from '../../constants';
import { FalconerRequestInit } from '../../types';

export interface RoadmapPeriod {
  title: string;
  goals: string[];
  isAchieved?: boolean;
}

export async function getIslamicRoadmapData(
  options: Partial<FalconerRequestInit>,
  locale: string,
) {
  const requestUrl = new URL('/islamic/roadmap', FALCONER_ENDPOINT);

  requestUrl.searchParams.append('locale', locale);

  const response = await fetch(requestUrl, {
    method: 'GET',
    ...options,
  });

  if (!response.ok) {
    throw new Error('Roadmap fetch failed');
  }

  const responseJson = await response.json();

  return responseJson.items as RoadmapPeriod[];
}
