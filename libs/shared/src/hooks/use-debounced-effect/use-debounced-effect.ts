import { useCallback, useEffect } from 'react';

// Example: prevent double-clicks from user of handle inputs for search boxes
export const useDebouncedEffect = (
  effect: (args?: never[]) => Promise<void> | void,
  delay = 100,
  deps?: never[],
) => {
  const callback = useCallback(effect, [effect, deps]);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback(deps?.[0]);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay, deps]);
};
