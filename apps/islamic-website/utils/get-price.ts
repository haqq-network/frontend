import { cache } from 'react';
import { getIslamicPriceData } from '@haqq/data-access-falconer';
import { REVALIDATE_TIME } from '../constants';

export const revalidate = REVALIDATE_TIME;

export const getPriceFromFalconer = cache(async () => {
  try {
    return await getIslamicPriceData({
      next: {
        revalidate,
      },
    });
  } catch (error) {
    console.error(error);
    return 0;
  }
});
