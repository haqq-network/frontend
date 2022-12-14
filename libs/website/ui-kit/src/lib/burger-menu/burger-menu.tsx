import clsx from 'clsx';
import { ReactNode } from 'react';

export interface BurgerMenuProps {
  children: ReactNode;
  className?: string;
}

export function BurgerMenu({ children, className }: BurgerMenuProps) {
  return (
    <div
      className={clsx(
        'fixed h-full w-full top-0 right-0 bg-haqq-black z-50',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default BurgerMenu;
