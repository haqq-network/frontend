import { getHaqqPrivacyPolicyData } from '@haqq/data-access-falconer';
import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';

export const revalidate = REVALIDATE_TIME;

export const getPrivacyPolicyContentFromFalconer = cache(async () => {
  try {
    const data = await getHaqqPrivacyPolicyData({
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
