import { ReactNode } from 'react';
import clsx from 'clsx';
import logoImageData from '../../assets/images/logo.svg';
import { NavLink } from 'react-router-dom';

export function Header({
  rightSlot,
  darkBackground,
}: {
  rightSlot?: ReactNode;
  darkBackground?: boolean;
}) {
  return (
    <header
      className={clsx(
        'h-[62px] w-full border-b border-t border-[#464647] sm:h-[72px]',
        'transform-gpu backdrop-blur',
        darkBackground ? 'bg-[#0D0D0E]' : 'bg-transparent',
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
