import { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

export function Layout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex min-h-screen flex-col', className)}>
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
    <div className={clsx('container mx-auto px-4 sm:px-6 lg:px-8', className)}>
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
      {header && <div className="flex-0 sticky top-0 z-40">{header}</div>}
      <div className="bg-light-green relative flex flex-1 flex-col">
        {children}
      </div>
      {footer ? footer : null}
    </Layout>
  );
}
