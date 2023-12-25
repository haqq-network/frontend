import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';
import { getIslamicDisclaimer } from '@haqq/data-access-falconer';

export const revalidate = REVALIDATE_TIME;

export const getDisclaimerContentFromFalconer = cache(
  async (locale: string) => {
    try {
      const data = await getIslamicDisclaimer(
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
