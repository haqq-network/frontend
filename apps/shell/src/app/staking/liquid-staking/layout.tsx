import { ReactNode } from 'react';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function Layout({
  modals,
  children,
}: {
  modals: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      {children}
      {modals}
    </>
  );
}
