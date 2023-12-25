import { FALCONER_ENDPOINT } from '../../constants';
import { FalconerRequestInit } from '../../types';

interface RoadmapPeriod {
  title: string;
  goals: string[];
  isAchieved?: boolean;
}

export async function getIslamicRoadmap(
  options: Partial<FalconerRequestInit>,
  locale: string,
) {
  const requestUrl = new URL(
    `/islamic/roadmap?locale=${locale}`,
    FALCONER_ENDPOINT,
  );
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
