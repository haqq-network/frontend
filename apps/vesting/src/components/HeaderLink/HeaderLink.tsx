import { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

interface HeaderLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export function HeaderLink({
  children,
  to,
  className,
}: HeaderLinkProps): ReactElement {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        return clsx(
          'text-base font-normal leading-[20px]',
          'hover:text-primary active:text-primary',
          'underline-offset-2 hover:underline',
          isActive ? 'text-primary' : 'text-black',
          className,
        );
      }}
    >
      {children}
    </NavLink>
  );
}
