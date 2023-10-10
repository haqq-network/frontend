import { FALCONER_ENDPOINT, REVALIDATE_TIME } from '../constants';
import { cache } from 'react';

export const revalidate = REVALIDATE_TIME;

export const getWhitepaperContent = cache(async (locale: string) => {
  try {
    const response = await fetch(`${FALCONER_ENDPOINT}/islamic/wp`, {
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
      const data = await response.json();
      return data.wp;
    }
  } catch (error) {
    console.error(error);
  }
});
