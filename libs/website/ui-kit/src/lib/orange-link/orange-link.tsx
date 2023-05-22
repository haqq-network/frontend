import clsx from 'clsx';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

interface OrangeLinkProps {
  className?: string;
  href: string;
  target?: string;
  rel?: string;
  withArrow?: boolean;
}

export function OrangeLink({
  children,
  className,
  href,
  target,
  rel,
  withArrow = false,
}: PropsWithChildren<OrangeLinkProps>) {
  return (
    <Link
      href={href}
      className={clsx(
        'text-[14px] font-[600] leading-[1.2em] text-[#EC5728] hover:text-[#FF8D69]',
        'cursor-pointer transition-colors duration-100 ease-out',
        'inline-flex items-center gap-x-[4px]',
        className,
      )}
      target={target}
      rel={rel}
    >
      {children}
      {withArrow && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.2874 8.30374L12.2874 13.363L13.954 13.363L13.954 5.45857H6.04965V7.12523L11.1089 7.12523L4.28188 13.9522L5.46039 15.1307L12.2874 8.30374Z"
            fill="currentColor"
          />
        </svg>
      )}
    </Link>
  );
}
