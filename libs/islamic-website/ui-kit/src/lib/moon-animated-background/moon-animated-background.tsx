'use client';

import { useCallback, useState } from 'react';
import { Container } from '../container/container';
import clsx from 'clsx';
import Image from 'next/image';

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}
export function MoonAnimatedBg({
  className,
  isAnimationNeeded,
}: {
  className?: string;
  isAnimationNeeded?: boolean;
}) {
  const [animationStep, setAnimationStep] = useState<1 | 2 | 3>(
    isAnimationNeeded ? 1 : 3,
  );

  const startAnimation = useCallback(async () => {
    if (isAnimationNeeded) {
      setAnimationStep(2);
      await delay(3000);
      setAnimationStep(3);
    }
  }, [isAnimationNeeded]);

  return (
    <Container className="relative">
      <div
        className={clsx(
          'absolute z-[-1] select-none',
          'h-[1011px] w-[1038px] md:h-[877px] md:w-[901px] lg:h-[1401px] lg:w-[1439px]',
          '-top-1/2 right-1/2',
          'ease-in-out',
          animationStep === 1 && 'scale-[.9] opacity-0',
          animationStep === 2 && 'opacity-90 duration-[3000ms]',
          animationStep === 3 && 'scale-[1] opacity-100 duration-[4000ms]',
          className,
        )}
      >
        <div
          className={clsx(
            'z-1 pointer-events-none absolute inset-0 scale-[3.5] transform rounded-full bg-gradient-to-r from-[#010304] from-10% to-transparent duration-[4000ms] ease-out md:scale-100 lg:scale-[1.5] xl:scale-100',
            animationStep === 2 && 'rotate-90',
          )}
        />
        <Image
          src="/assets/images/moon.webp"
          alt=""
          fill
          className="pointer-events-none z-[-2]"
          priority
          onLoad={() => {
            startAnimation();
          }}
        />
      </div>
    </Container>
  );
}
