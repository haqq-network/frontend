'use client';
import { PropsWithChildren } from 'react';
import { Context as ResponsiveContext } from 'react-responsive';

export function ResponsiveProvider({
  children,
  isMobileUserAgent,
}: PropsWithChildren<{ isMobileUserAgent?: boolean }>) {
  if (!isMobileUserAgent) {
    return children;
  }

  return (
    <ResponsiveContext.Provider value={{ width: 375 }}>
      {children}
    </ResponsiveContext.Provider>
  );
}
