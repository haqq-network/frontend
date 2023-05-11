import { useEffect, useRef } from 'react';
import Jazzicon from '@metamask/jazzicon';
import clsx from 'clsx';

export interface IdentIconProps {
  address: string;
  size?: number;
  className?: string;
}

export function IdentIcon({ address, size = 16, className }: IdentIconProps) {
  const iconElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iconElementRef.current) {
      iconElementRef.current.innerHTML = '';
      iconElementRef.current.appendChild(
        Jazzicon(size, parseInt(address.slice(2, 10), 16)),
      );
    }
  }, [address, size]);

  return (
    <div
      ref={iconElementRef}
      className={clsx(
        'inline-block overflow-hidden rounded-full leading-[0px]',
        className,
      )}
    />
  );
}
