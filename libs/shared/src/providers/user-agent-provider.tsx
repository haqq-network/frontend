'use client';
import { createContext, ReactNode, useContext } from 'react';

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

export function useUserAgent() {
  const userAgent = useContext(UserAgentContext);

  return userAgent;
}
