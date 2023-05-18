import { ReactNode } from 'react';
import clsx from 'clsx';
import logoImageData from '../../assets/images/logo.svg';
import { NavLink } from 'react-router-dom';
import { useWindowWidth } from '@haqq/shared';

interface HeaderProps {
  rightSlot?: ReactNode;
  darkBackground?: boolean;
}

export function Header({ rightSlot, darkBackground = false }: HeaderProps) {
  const { width } = useWindowWidth();
  return (
    <header
      className={clsx(
        'h-[63px] w-full border-y border-[#464647] sm:h-[72px]',
        'transform-gpu backdrop-blur',
        'sticky top-0 z-50',
        darkBackground && width < 1024 ? 'bg-haqq-black' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-full w-full flex-row items-center pr-[16px] sm:pr-[64px] lg:pr-[80px]">
        <div className="flex h-full w-[48px] items-center justify-center border-r border-[#464647] sm:w-[64px] lg:w-[80px]">
          <div className="relative h-[26px] w-[26px] sm:h-[32px] sm:w-[32px]">
            <NavLink to="/">
              <img src={logoImageData} alt="HAQQ" />
            </NavLink>
          </div>
        </div>
        <div className="ml-[20px] font-serif text-[24px] font-medium leading-none lg:ml-[32px]">
          <NavLink to="/">HAQQ</NavLink>
        </div>
        <div className="flex-1" />

        {rightSlot && (
          <div className="flex flex-row items-center space-x-2">
            {rightSlot}
          </div>
        )}
      </div>
    </header>
  );
}
