import { ReactNode } from 'react';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import logoImageData from '../../assets/images/logo.svg';

export function Header({
  rightSlot,
  darkBackground = false,
  isBlurred = false,
}: {
  rightSlot?: ReactNode;
  darkBackground?: boolean;
  isBlurred?: boolean;
}) {
  return (
    <header
      className={clsx(
        'z-50 h-[62px] w-full transform-gpu border-y border-[#464647] sm:h-[72px]',
        darkBackground ? 'bg-haqq-black' : 'bg-transparent',
        isBlurred && !darkBackground && 'backdrop-blur',
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
        <div className="font-clash ml-[20px] text-[24px] font-medium leading-none lg:ml-[32px]">
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
