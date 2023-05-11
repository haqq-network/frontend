import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

export function HeaderNavLink({
  href,
  children,
  isOutLink = false,
}: {
  href: string;
  children: ReactNode;
  isOutLink?: boolean;
}) {
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
      {...additionalProps}
    >
      {children}
    </NavLink>
  );
}
