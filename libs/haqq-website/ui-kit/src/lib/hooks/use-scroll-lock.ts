import { useEffect } from 'react';

export function useScrollLock(isActive = false) {
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isActive]);
}
