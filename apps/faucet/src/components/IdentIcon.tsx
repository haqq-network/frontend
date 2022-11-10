import { useEffect, useRef } from 'react';
import Jazzicon from '@metamask/jazzicon';

export function IdentIcon({
  address,
  size = 16,
}: {
  address: string;
  size?: number;
}) {
  const iconElementRef = useRef<HTMLDivElement>(null);
  // FIXME: stop using ref for address
  const addressRef = useRef<string>();

  useEffect(() => {
    if (iconElementRef.current) {
      if (addressRef.current !== address) {
        addressRef.current = address;
        iconElementRef.current.innerHTML = '';
        iconElementRef.current.appendChild(
          Jazzicon(size, parseInt(address.slice(2, 10), 16)),
        );
      }
    }
  }, [address, size]);

  return <div ref={iconElementRef} className="inline-block leading-[0px]" />;
}
