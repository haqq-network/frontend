import { useMemo } from 'react';

export function useNextUnlockDate(startDate: Date, period: number): Date {
  const nextUnlockDate = useMemo(() => {
    const now = Date.now();
    const offset = period * 1000;
    let unlockTime = startDate.getTime();

    while (unlockTime <= now) {
      unlockTime += offset;
    }

    return new Date(unlockTime);
  }, [startDate, period]);

  return nextUnlockDate;
}
