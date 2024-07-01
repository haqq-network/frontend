'use client';
import { useCallback, useState, useMemo, useLayoutEffect } from 'react';
import throttle from 'lodash/throttle';

interface ScrollTrackHookOptions {
  fps?: number;
}

interface ScrollTrackState {
  left: number;
  top: number;
}

type ScrollEventHandler = (event: Event) => void;

const initialScrollState = {
  left: 0,
  top: 0,
};

export function useScrollTrack(
  element: HTMLElement | Window | null,
  { fps = 60 }: ScrollTrackHookOptions = {},
): ScrollTrackState {
  const [scrollState, setScrollState] =
    useState<ScrollTrackState>(initialScrollState);

  const handleScroll = useCallback((event: Event) => {
    const target =
      event.target === document
        ? document.documentElement
        : (event.target as HTMLElement);

    setScrollState({
      left: target.scrollLeft,
      top: target.scrollTop,
    });
  }, []);

  const handleScrollThrottled = useMemo(() => {
    return throttle<ScrollEventHandler>(handleScroll, 1000 / fps);
  }, [fps, handleScroll]);

  useLayoutEffect(() => {
    if (element) {
      const target = element === window ? window : (element as HTMLElement);

      if (element === window) {
        setScrollState({
          left: window.scrollX,
          top: window.scrollY,
        });
      } else {
        setScrollState({
          left: (element as HTMLElement).scrollLeft,
          top: (element as HTMLElement).scrollTop,
        });
      }

      target.addEventListener('scroll', handleScrollThrottled, {
        passive: true,
      });

      return () => {
        target.removeEventListener('scroll', handleScrollThrottled);
      };
    }
  }, [element, handleScrollThrottled]);

  return scrollState;
}
