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
          'hover:underline underline-offset-2',
          isActive ? 'text-primary' : 'text-black',
          className,
        );
      }}
    >
      {children}
    </NavLink>
  );
}
