import React, { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { Logo, LogoSmall } from './Logo';

export function Layout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('min-h-screen flex flex-col', className)}>
      {children}
    </div>
  );
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('container px-4 sm:px-6 lg:px-8 mx-auto', className)}>
      {children}
    </div>
  );
}

export interface PageProps {
  children?: ReactNode;
  header?: ReactElement;
  footer?: ReactElement;
}

export function Page({ children, header, footer }: PageProps): ReactElement {
  return (
    <Layout>
      {/* TODO: BANNER COMPONENT MUST BE PLACED HERE */}
      {header && <div className="sticky top-0 flex-0 z-40">{header}</div>}
      <div className="flex-1 flex flex-col overflow-x-hidden relative bg-light-green">
        {children}
      </div>
      {footer ? footer : null}
    </Layout>
  );
}

export function Header(): ReactElement {
  return (
    <header className="backdrop-filter backdrop-blur transform-gpu bg-white/70 border-slate-400/10 border-b">
      <Container>
        <div className="relative flex items-center justify-between h-[64px]">
          <div className="flex-1 flex items-center justify-start space-x-12">
            <NavLink to="/" className="text-[#04d484]">
              <Logo className="h-8 w-auto hidden sm:block" />
              <LogoSmall className="h-10 w-auto block sm:hidden" />
            </NavLink>
            {/* <div className="flex-1 flex flex-row items-center space-x-4">
              <NavLink
                to="/staking"
                // className={({ isActive }) => {
                //   return isActive ? 'text-[#04d484]' : '';
                // }}
              >
                Staking
              </NavLink>
            </div> */}
          </div>

          <div className="flex flex-row space-x-2">
            <NavLink to="/staking">Staking</NavLink>
          </div>
        </div>
      </Container>
    </header>
  );
}
