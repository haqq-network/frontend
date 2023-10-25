import { REVALIDATE_TIME, FALCONER_ENDPOINT } from '../constants';
import { cache } from 'react';

export const revalidate = REVALIDATE_TIME;

export const getWhitepaper = cache(async () => {
  try {
    const response = await fetch(`${FALCONER_ENDPOINT}/islamic/wp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      next: {
        revalidate,
      },
    });

    if (response.ok) {
      const data = await response.json();

      return data.wp as string;
    }
  } catch (error) {
    console.error(error);
  }

  return '';
});
