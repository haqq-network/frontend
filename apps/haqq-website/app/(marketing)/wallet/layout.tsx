import type { PropsWithChildren } from 'react';

export default function WalletPageLayout({ children }: PropsWithChildren) {
  return (
    <main className="font-manrope flex min-h-screen flex-col overflow-x-clip will-change-scroll">
      {children}
    </main>
  );
}
