import { cache } from 'react';
import { getHaqqWhitepaperData } from '@haqq/data-access-falconer';
import { REVALIDATE_TIME } from '../constants';

export const revalidate = REVALIDATE_TIME;

export const getWhitepaperContentFromFalconer = cache(async () => {
  try {
    const data = await getHaqqWhitepaperData({
      next: {
        revalidate,
      },
    });

    return data;
  } catch (error) {
    console.error(error);
  }

  return '';
});
