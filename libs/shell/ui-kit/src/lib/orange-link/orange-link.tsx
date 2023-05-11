import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

export function OrangeLink({
  children,
  className,
  href,
  target,
  rel,
}: PropsWithChildren<{
  className?: string;
  href: string;
  target?: string;
  rel?: string;
}>) {
  return (
    <Link
      to={href}
      className={clsx(
        'text-[14px] font-[600] leading-[1.2em] text-[#EC5728] hover:text-[#FF8D69]',
        'cursor-pointer transition-colors duration-100 ease-out',
        className,
      )}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
}
