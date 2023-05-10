import { ReactNode } from 'react';
import { Page } from '@haqq/ui-kit';
import { Header } from '@haqq/shell/ui-kit';

export function AppWrapper({ children }: { children: ReactNode }) {
  return <Page header={<Header />}>{children}</Page>;
}
