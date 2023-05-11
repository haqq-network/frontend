import { ReactElement, ReactNode } from 'react';
import { Layout } from '../layout/layout';

export interface PageProps {
  children?: ReactNode;
  header?: ReactElement;
  footer?: ReactElement;
  className?: string;
}

export function Page({
  children,
  header,
  footer,
  className,
}: PageProps): ReactElement {
  return (
    <Layout className={className}>
      {/* TODO: BANNER COMPONENT MUST BE PLACED HERE */}
      {header && <div className="flex-0 sticky top-0 z-50">{header}</div>}
      <div className="relative flex flex-1 flex-col overflow-x-clip">
        {children}
      </div>
      {footer ? footer : null}
    </Layout>
  );
}
