import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';
import { getIslamicDisclaimerData } from '@haqq/data-access-falconer';

export const revalidate = REVALIDATE_TIME;

export const getDisclaimerContentFromFalconer = cache(
  async (locale: string) => {
    try {
      const data = await getIslamicDisclaimerData(
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

    return '';
  },
);
