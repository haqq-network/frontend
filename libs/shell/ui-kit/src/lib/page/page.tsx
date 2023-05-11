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
      {header && <div className="sticky top-0 flex-0 z-50">{header}</div>}
      <div className="flex-1 flex flex-col relative">{children}</div>
      {footer ? footer : null}
    </Layout>
  );
}
