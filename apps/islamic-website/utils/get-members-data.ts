import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';
import { getMembersData } from '@haqq/data-access-falconer';

export const revalidate = REVALIDATE_TIME;

export const getMembersContentFromFalconer = cache(async (locale: string) => {
  try {
    const {
      advisoryMembers,
      executiveMembers,
      founderMembers,
      shariahMembers,
      teamMembers,
    } = await getMembersData(
      {
        next: {
          revalidate,
        },
      },
      locale,
    );

    return {
      advisoryMembers,
      executiveMembers,
      shariahMembers,
      teamMembers,
      founderMembers,
    };
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
