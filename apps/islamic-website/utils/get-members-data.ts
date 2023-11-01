import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';
import { getMembersData } from '@haqq/data-access-falconer';

export const revalidate = REVALIDATE_TIME;

export const getMembersContentFromFalconer = cache(async (locale: string) => {
  try {
    const members = await getMembersData(
      {
        next: {
          revalidate,
        },
      },
      locale,
    );

    return {
      advisoryMembers: members.members.advisory_members,
      executiveMembers: members.members.executive_members,
      shariahMembers: members.members.shariah_members,
      teamMembers: members.members.team_members,
      founderMembers: members.members.founder_members,
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
