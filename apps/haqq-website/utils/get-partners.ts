import { cache } from 'react';
import { getHaqqPartnersData } from '@haqq/data-access-falconer';
import { REVALIDATE_TIME } from '../constants';

export const revalidate = REVALIDATE_TIME;

export const getHaqqPartnersFromFalconer = cache(async () => {
  try {
    const data = await getHaqqPartnersData({
      next: {
        revalidate,
      },
    });

    return data;
  } catch (error) {
    console.error(error);
  }

  return [];
});
