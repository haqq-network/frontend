import { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

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
    <NavLink
      to={href}
      className="font-sans text-[13px] leading-[20px] sm:text-[15px] sm:leading-[24px]"
      onClick={onClick}
      {...additionalProps}
    >
      {children}
    </NavLink>
  );
}
