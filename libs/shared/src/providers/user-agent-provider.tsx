'use client';
import { createContext, ReactNode } from 'react';

export const UserAgentContext = createContext({ isMobileUA: false });

export function UserAgentProvider({
  isMobileUA,
  children,
}: {
  isMobileUA: boolean;
  children: ReactNode;
}) {
  return (
    <UserAgentContext.Provider value={{ isMobileUA }}>
      {children}
    </UserAgentContext.Provider>
  );
}
