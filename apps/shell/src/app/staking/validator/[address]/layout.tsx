import { ReactNode } from 'react';

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
