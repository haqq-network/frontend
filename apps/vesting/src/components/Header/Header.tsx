import { lazy, ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { Container } from '../Layout/Layout';
import { Logo, LogoSmall } from '../Logo/Logo';

const ConnectButton = lazy(() => {
  return import('../ConnectButton/ConnectButton');
});
const NetworkStatus = lazy(() => {
  return import('../NetworkStatus/NetworkStatus');
});

export function Header(): ReactElement {
  return (
    <header className="border-light-gray transform-gpu border-b bg-white/70 backdrop-blur">
      <Container>
        <div className="relative flex h-[64px] items-center justify-between">
          <div className="flex flex-1 items-center justify-start">
            <NavLink to="/">
              <Logo className="hidden h-8 w-auto sm:block" />
              <LogoSmall className="block h-10 w-auto sm:hidden" />
            </NavLink>
            <div className="flex flex-shrink-0 items-center"></div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
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
