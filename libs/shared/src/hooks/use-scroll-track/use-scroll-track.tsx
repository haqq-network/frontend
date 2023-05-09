import { useRef, useCallback, useState, useMemo } from 'react';
import throttle from 'lodash/throttle';

interface ScrollTrackHookOptions {
  fps?: number;
}

interface ScrollTrackState {
  left: number;
  top: number;
}

type ScrollTrackSetRef = (node: HTMLElement) => void;
type ScrollEventHandler = (event: Event) => void;
type ScrollTrackHook = [ScrollTrackState, ScrollTrackSetRef];

export function useScrollTrack({
  fps = 60,
}: ScrollTrackHookOptions = {}): ScrollTrackHook {
  const ref = useRef<HTMLElement | undefined>(undefined);
  const [scrollState, setScrollState] = useState<ScrollTrackState>({
    left: 0,
    top: 0,
  });

  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLElement;

    setScrollState({
      left: target.scrollLeft,
      top: target.scrollTop,
    });
  }, []);

  const handleScrollThrottled = useMemo(() => {
    return throttle<ScrollEventHandler>(handleScroll, 1000 / fps);
  }, [fps, handleScroll]);

  const setRef = useCallback<ScrollTrackSetRef>(
    (node) => {
      if (ref.current !== undefined) {
        ref.current.removeEventListener('scroll', handleScrollThrottled);
        ref.current = undefined;
        setScrollState({ left: 0, top: 0 });
      } else if (node !== null) {
        ref.current = node;
        ref.current.addEventListener('scroll', handleScrollThrottled, {
          passive: true,
        });
      }
    },
    [handleScrollThrottled],
  );

  const memoizedScrollState = useMemo(() => {
    return {
      left: scrollState.left,
      top: scrollState.top,
    };
  }, [scrollState.left, scrollState.top]);

  const hookReturn = useMemo<ScrollTrackHook>(() => {
    return [memoizedScrollState, setRef];
  }, [memoizedScrollState, setRef]);

  return hookReturn;
}
