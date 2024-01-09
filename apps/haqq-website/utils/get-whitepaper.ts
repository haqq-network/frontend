import { getIslamicWhitepaperData } from '@haqq/data-access-falconer';
import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';

export const revalidate = REVALIDATE_TIME;

export const getWhitepaperContentFromFalconer = cache(
  async (locale?: string) => {
    try {
      const data = await getIslamicWhitepaperData(
        {
          next: {
            revalidate,
          },
        },
        locale ? locale : 'en',
      );

      return data;
    } catch (error) {
      console.error(error);
    }

    return '';
  },
);
