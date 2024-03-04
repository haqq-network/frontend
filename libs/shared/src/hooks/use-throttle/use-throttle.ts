import { useEffect, useRef, useState } from 'react';

export function useThrottle<T>(value: T, interval = 500) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef<number>();

  useEffect(() => {
    const now = Date.now();

    if (lastUpdated.current && now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);

      return () => {
        return void 0;
      };
    } else {
      const id = window.setTimeout(() => {
        lastUpdated.current = now;
        setThrottledValue(value);
      }, interval);

      return () => {
        window.clearTimeout(id);
      };
    }
  }, [value, interval]);

  return throttledValue;
}
