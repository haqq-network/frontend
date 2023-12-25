import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';
import { getHaqqPartners } from '@haqq/data-access-falconer';

export const revalidate = REVALIDATE_TIME;

export const getHAQQPartnersFromFalconer = cache(async () => {
  try {
    const data = await getHaqqPartners({
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
