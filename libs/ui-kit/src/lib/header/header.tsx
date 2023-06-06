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
    <header className="transform-gpu border-b border-slate-400/10 bg-white/30 backdrop-blur dark:bg-[#0c0c0c66]">
      <Container>
        <div className="relative flex h-[64px] items-center justify-between">
          <div className="flex flex-1 items-center justify-start space-x-12">
            <NavLink to="/">
              <HaqqLogo className="h-8 w-auto" />
            </NavLink>

            {/* Links must be here */}
          </div>

          {rightSlot && (
            <div className="flex flex-row items-center space-x-2">
              {rightSlot}
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
