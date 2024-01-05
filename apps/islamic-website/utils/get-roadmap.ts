import { cache } from 'react';
import { REVALIDATE_TIME } from '../constants';
import { getIslamicRoadmapData } from '@haqq/data-access-falconer';

export const revalidate = REVALIDATE_TIME;

export const getRoadmapContentFromFalconer = cache(async (locale: string) => {
  try {
    const data = await getIslamicRoadmapData(
      {
        next: {
          revalidate,
        },
      },
      locale,
    );

    return data;
  } catch (error) {
    console.error(error);
  }

  return [];
});
