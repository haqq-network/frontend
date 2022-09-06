import React, { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

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
