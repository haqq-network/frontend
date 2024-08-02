'use client';
import { useState } from 'react';
import {
  useSpring,
  config,
  animated,
  to,
  useIsomorphicLayoutEffect,
} from '@react-spring/web';
import Image from 'next/image';
import { useScrollTrack } from '@haqq/shell-ui-kit';
import { interpolate } from '@haqq/shell-ui-kit/server';

export function ParalaxBackground() {
  const [loaded, setLoaded] = useState(false);
  const { top } = useScrollTrack(typeof window !== 'undefined' ? window : null);

  const mountAnimValues = useSpring({
    translateY: loaded ? 0 : -50,
    scale: loaded ? 1 : 0.95,
    config: {
      ...config.gentle,
      duration: 750,
    },
  });

  const mountAnimOpacityValues = useSpring({
    opacity: loaded ? 1 : 0,
    config: {
      ...config.gentle,
      duration: 1000,
    },
  });

  const [translateValues, setTranslateValues] = useSpring(() => {
    return {
      translateY: 0,
      scale: 1,
      config: { duration: 10, delay: 0 },
    };
  });

  useIsomorphicLayoutEffect(() => {
    setTranslateValues({
      translateY: interpolate(top, [0, 800], [0, 500]),
      scale: interpolate(top, [50, 500], [1, 1.3]),
    });
  }, [setTranslateValues, top]);

  return (
    <animated.div
      className="pointer-events-none fixed left-0 top-0 z-[-1] h-auto w-full transform"
      style={{
        transform: to(
          [translateValues.translateY, translateValues.scale],
          (translateY, scale) => {
            return `translateY(${translateY * -0.35}px) scale(${scale})`;
          },
        ),
      }}
    >
      <animated.div
        style={{
          opacity: mountAnimOpacityValues.opacity,
          transform: to(
            [mountAnimValues.translateY, mountAnimValues.scale],
            (translateY, scale) => {
              return `translateY(${translateY}px) scale(${scale})`;
            },
          ),
        }}
      >
        <Image
          src={'/sunrise.jpg'}
          width={2280}
          height={768}
          alt=""
          onLoad={() => {
            setLoaded(true);
          }}
          className="scale-[1.5] md:scale-[1]"
          priority
        />
      </animated.div>
    </animated.div>
  );
}
