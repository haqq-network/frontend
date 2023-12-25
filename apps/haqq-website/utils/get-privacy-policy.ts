import { getIslamicPrivacyPolicyData } from '@haqq/data-access-falconer';
import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';

export const revalidate = REVALIDATE_TIME;

export const getPrivacyPolicyContentFromFalconer = cache(
  async (locale: string) => {
    try {
      const data = await getIslamicPrivacyPolicyData(
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
