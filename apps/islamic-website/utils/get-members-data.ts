import { Member } from '@haqq/islamic-website-ui-kit';
import { FALCONER_ENDPOINT, REVALIDATE_TIME } from '../constants';
import { cache } from 'react';

export const revalidate = REVALIDATE_TIME;

export const getMembersContent = cache(
  async (
    locale: string,
  ): Promise<{
    advisoryMembers: Member[];
    executiveMembers: Member[];
    shariahMembers: Member[];
    teamMembers: Member[];
    founderMembers: Member[];
  }> => {
    try {
      const response = await fetch(`${FALCONER_ENDPOINT}/islamic/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locale }),
        next: {
          revalidate,
        },
      });
      if (response.ok) {
        const {
          members: {
            advisory_members,
            executive_members,
            shariah_members,
            team_members,
            founder_members,
          },
        } = await response.json();
        return {
          advisoryMembers: advisory_members,
          executiveMembers: executive_members,
          shariahMembers: shariah_members,
          teamMembers: team_members,
          founderMembers: founder_members,
        };
      } else {
        console.log('Response was not ok.', response);
      }
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
  },
);
