import { getIslamicNewsData } from '@haqq/data-access-falconer';
import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';

export const revalidate = REVALIDATE_TIME;

export const getNewsPageContentFromFalconer = cache(async (limit?: number) => {
  try {
    const data = await getIslamicNewsData(
      {
        next: {
          revalidate,
        },
      },
      limit,
    );

    return data;
  } catch (error) {
    console.error(error);
  }

  return undefined;
});
