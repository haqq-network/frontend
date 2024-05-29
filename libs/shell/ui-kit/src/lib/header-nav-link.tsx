import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

interface HeaderNavLinkProps {
  href: string;
  isOutLink?: boolean;
  onClick?: () => void;
  className?: string;
}

export function HeaderNavLink({
  href,
  children,
  isOutLink = false,
  onClick,
  className,
}: PropsWithChildren<HeaderNavLinkProps>) {
  const additionalProps = isOutLink
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};
  return (
    <Link
      href={href}
      className={clsx(
        'font-guise text-[13px] leading-[20px] sm:text-[15px] sm:leading-[24px]',
        className,
      )}
      onClick={onClick}
      {...additionalProps}
    >
      {children}
    </Link>
  );
}
