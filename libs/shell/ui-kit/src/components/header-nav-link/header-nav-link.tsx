import { PropsWithChildren } from 'react';
import Link from 'next/link';

interface HeaderNavLinkProps {
  href: string;
  isOutLink?: boolean;
  onClick?: () => void;
}

export function HeaderNavLink({
  href,
  children,
  isOutLink = false,
  onClick,
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
      className="font-guise text-[13px] leading-[20px] sm:text-[15px] sm:leading-[24px]"
      onClick={onClick}
      {...additionalProps}
    >
      {children}
    </Link>
  );
}
