import { lazy, ReactElement, Suspense } from 'react';
import { NavLink } from 'react-router-dom';
import { Container } from './Layout/Layout';
import { Logo, LogoSmall } from './Logo/Logo';

const Web3ConnectButtons = lazy(() => {
  return import('./web3-connect-button');
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
            <div className="flex flex-shrink-0 items-center" />
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="flex flex-row space-x-2">
              <Suspense
                fallback={
                  <div className="animate-pulse">
                    <div className="bg-primary h-[20px] w-[60px] rounded opacity-30" />
                  </div>
                }
              >
                <Web3ConnectButtons />
              </Suspense>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
