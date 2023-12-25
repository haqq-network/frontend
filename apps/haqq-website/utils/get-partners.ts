import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';
import { getHaqqPartnersData } from '@haqq/data-access-falconer';

export const revalidate = REVALIDATE_TIME;

export const getHAQQPartnersFromFalconer = cache(async () => {
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
