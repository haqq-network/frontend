import { getIslamicHomePageData } from '@haqq/data-access-falconer';
import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';

export const revalidate = REVALIDATE_TIME;

export const getHomePageDataFromFalconer = cache(async (locale: string) => {
  try {
    const data = await getIslamicHomePageData(
      {
        next: {
          revalidate,
        },
      },
      locale,
    );

    return {
      advisoryMembers: data.advisoryMembers,
      executiveMembers: data.executiveMembers,
      shariahMembers: data.shariahMembers,
      news: data.news,
    };
  } catch (error) {
    console.error(error);
  }

  return {
    advisoryMembers: [],
    executiveMembers: [],
    shariahMembers: [],
    news: [],
  };
});
