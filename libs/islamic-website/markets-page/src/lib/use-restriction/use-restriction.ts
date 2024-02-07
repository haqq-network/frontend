import { useEffect, useState } from 'react';

async function getUserCountry() {
  const apis = ['https://api.country.is', 'https://ipapi.co/json'];

  let country;
  for (const api of apis) {
    try {
      const res = await fetch(api);
      const data = await res.json();
      country = data.country;
      break;
    } catch (error) {
      console.error(error);
    }
  }
  if (!country) {
    throw Error;
  }

  return country;
}

export function useRestriction() {
  const [isRestricted, setIsRestricted] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        if (window.location.host.includes('AE')) {
          return;
        }
        const country = await getUserCountry();
        if ('AE' !== country) {
          setIsRestricted(false);
        }
      } catch (error) {
        console.error('Failed to get country by IP.');
      }
    }
    check();
  }, []);

  return { isRestricted };
}
