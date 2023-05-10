import { ReactNode } from 'react';
import { Header, Page } from '@haqq/shell/ui-kit';

export function AppWrapper({ children }: { children: ReactNode }) {
  return <Page header={<Header />}>{children}</Page>;
}
