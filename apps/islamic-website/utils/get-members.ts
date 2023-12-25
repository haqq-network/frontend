import { getIslamicMembersData } from '@haqq/data-access-falconer';
import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';

export const revalidate = REVALIDATE_TIME;

export const getMembersContentFromFalconer = cache(async (locale: string) => {
  try {
    const data = await getIslamicMembersData(
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

  return {
    advisoryMembers: [],
    executiveMembers: [],
    shariahMembers: [],
    teamMembers: [],
    founderMembers: [],
  };
});
