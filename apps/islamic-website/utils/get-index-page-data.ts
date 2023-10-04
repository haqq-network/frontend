import { FALCONER_ENDPOINT } from '../constants';
import { cache } from 'react';

export const getHomePageContent = cache(async () => {
  try {
    const response = await fetch(`${FALCONER_ENDPOINT}/islamic/home`, {
      method: 'GET',
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
});
