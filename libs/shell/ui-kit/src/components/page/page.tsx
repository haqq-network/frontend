import { ReactElement, ReactNode } from 'react';
import { Layout } from '../layout/layout';

export function Page({
  children,
  header,
  footer,
  banner,
  className,
}: {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  banner?: ReactNode;
  className?: string;
}): ReactElement {
  return (
    <Layout className={className}>
      {header && (
        <div className="flex-0 sticky top-0 z-50">
          {banner ? banner : null}
          {header}
        </div>
      )}
      <div className="relative flex flex-1 flex-col overflow-x-clip">
        {children}
      </div>
      {footer ? footer : null}
    </Layout>
  );
}
