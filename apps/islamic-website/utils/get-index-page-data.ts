import { FALCONER_ENDPOINT } from '../constants';

export const getHomePageContent = async () => {
  try {
    const response = await fetch(`${FALCONER_ENDPOINT}/islamic/home`, {
      method: 'GET',
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
};
