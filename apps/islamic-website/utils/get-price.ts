import { cache } from 'react';
import { getHaqqPriceData } from '@haqq/data-access-falconer';
import { REVALIDATE_TIME } from '../constants';

export const revalidate = REVALIDATE_TIME;

export const getPriceFromFalconer = cache(async () => {
  try {
    return await getHaqqPriceData({
      next: {
        revalidate,
      },
    });
  } catch (error) {
    console.error(error);
    return 0;
  }
});
