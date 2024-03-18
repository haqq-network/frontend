import { ReactNode } from 'react';
import clsx from 'clsx';
import Image from 'next/image';

export function Layout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'relative flex min-h-screen flex-col',

        className,
      )}
    >
      <Image
        src="/sunrise.jpg"
        className="absolute top-0 h-auto w-full object-contain"
        alt=""
        width={2880}
        height={768}
        // loading="lazy"
        priority
        quality={100}
      />
      {children}
    </div>
  );
}
