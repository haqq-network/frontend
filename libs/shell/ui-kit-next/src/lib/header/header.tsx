import { ReactNode } from 'react';
import clsx from 'clsx';
import logoImageData from '../../assets/images/logo.svg';
import { NavLink } from 'react-router-dom';

export function Header({ rightSlot }: { rightSlot?: ReactNode }) {
  return (
    <header
      className={clsx(
        'border-t border-b border-[#464647] w-full h-[63px] sm:h-[72px]',
        'backdrop-blur transform-gpu',
        'top-0 sticky z-50',
      )}
    >
      <div className="w-full flex flex-row items-center h-full pr-[16px] sm:pr-[64px] lg:pr-[80px] mx-auto">
        <div className="w-[48px] sm:w-[64px] lg:w-[80px] h-full flex items-center justify-center border-r border-[#464647]">
          <div className="relative w-[26px] h-[26px] sm:w-[32px] sm:h-[32px]">
            <NavLink to="/">
              <img src={logoImageData} alt="HAQQ" />
            </NavLink>
          </div>
        </div>
        <div className="font-serif ml-[20px] lg:ml-[32px] font-medium text-[24px] leading-none">
          <NavLink to="/">HAQQ</NavLink>
        </div>
        <div className="flex-1" />

        {rightSlot && (
          <div className="flex flex-row space-x-2 items-center">
            {rightSlot}
          </div>
        )}
      </div>
    </header>
  );
}
