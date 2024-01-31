import { cache } from 'react';
import { getIslamicFatwaData } from '@haqq/data-access-falconer';
import { REVALIDATE_TIME } from '../constants';

export const revalidate = REVALIDATE_TIME;

export const getFatwaContentFromFalconer = cache(async (locale: string) => {
  try {
    const data = await getIslamicFatwaData(
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
