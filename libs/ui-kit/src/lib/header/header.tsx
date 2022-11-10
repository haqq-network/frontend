import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Container } from '../container/container';
import { HaqqLogo } from '../logo/logo';

export interface HeaderProps {
  rightSlot?: ReactNode;
}

export function Header({ rightSlot }: HeaderProps) {
  // function getLinkClassName({ isActive }: { isActive: boolean }) {
  //   return isActive ? 'text-[#04d484]' : '';
  // }

  return (
    <header className="backdrop-filter backdrop-blur transform-gpu bg-white/30 dark:bg-slate-700/10 border-slate-400/10 border-b">
      <Container>
        <div className="relative flex items-center justify-between h-[64px]">
          <div className="flex-1 flex items-center justify-start space-x-12">
            <NavLink to="/">
              {/* <IslamicLogo className="h-10 w-auto hidden sm:block" />
              <IslamicLogoSign className="h-10 w-auto block sm:hidden" /> */}

              <HaqqLogo className="block lg:hidden h-9 w-auto" />
              <HaqqLogo className="hidden lg:block h-9 w-auto" />
            </NavLink>

            {/* Links must be here */}
          </div>

          {rightSlot && (
            <div className="flex flex-row space-x-2">{rightSlot}</div>
          )}
        </div>
      </Container>
    </header>
  );
}
