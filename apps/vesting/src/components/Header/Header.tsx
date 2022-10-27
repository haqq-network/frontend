import { lazy, ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { Container } from '../Layout/Layout';
import { Logo, LogoSmall } from '../Logo/Logo';

const ConnectButton = lazy(() => import('../ConnectButton/ConnectButton'));
const NetworkStatus = lazy(() => import('../NetworkStatus/NetworkStatus'));

export function Header(): ReactElement {
  return (
    <header className="backdrop-filter backdrop-blur transform-gpu bg-white/70 border-light-gray border-b">
      <Container>
        <div className="relative flex items-center justify-between h-[64px]">
          <div className="flex-1 flex items-center justify-start">
            <NavLink to="/">
              <Logo className="h-8 w-auto hidden sm:block" />
              <LogoSmall className="h-10 w-auto block sm:hidden" />
            </NavLink>
            <div className="flex-shrink-0 flex items-center"></div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="flex flex-row space-x-2">
              <NetworkStatus />
              <ConnectButton />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
