import { cache } from 'react';
import { getIslamicRoadmapData } from '@haqq/data-access-falconer';
import { REVALIDATE_TIME } from '../constants';

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
