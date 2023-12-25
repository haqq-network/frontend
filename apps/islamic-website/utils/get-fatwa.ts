import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';
import { getIslamicFatwa } from '@haqq/data-access-falconer';

export const revalidate = REVALIDATE_TIME;

export const getFatwaContentFromFalconer = cache(async (locale: string) => {
  try {
    const data = await getIslamicFatwa(
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
});
