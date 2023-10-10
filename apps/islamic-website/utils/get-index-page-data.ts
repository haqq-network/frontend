import { cache } from 'react';
import { FALCONER_ENDPOINT } from '../constants';

export const getHomePageContent = cache(async (locale: string) => {
  try {
    const response = await fetch(`${FALCONER_ENDPOINT}/islamic/home`, {
      method: 'POST',
      body: JSON.stringify({ locale }),
      next: {
        revalidate: 180,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
});
