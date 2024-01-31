'use client';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';

export function AcademyAnimatedBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.25;
    }
  }, []);

  return (
    <div
      className={clsx(
        'absolute z-[-1]',
        'right-[-170px] top-[-100px] h-[470px] w-[443px]',
        'md:right-[0px] md:top-[0] md:h-[800px] md:w-[754px]',
        'pointer-events-none select-none',
      )}
    >
      <video
        autoPlay
        loop
        className="h-full w-full"
        controls={false}
        ref={videoRef}
      >
        <source src="/assets/video/academy-anim.webm" />
      </video>
    </div>
  );
}
