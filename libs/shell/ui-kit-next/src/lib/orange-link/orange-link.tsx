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
        'text-[#EC5728] text-[14px] leading-[1.2em] font-[600] hover:text-[#FF8D69]',
        'transition-colors duration-100 ease-out cursor-pointer',
        className,
      )}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
}
