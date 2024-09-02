'use client';
import { createContext, ReactNode } from 'react';

export const UserAgentContext = createContext({ isMobileUA: false });

export function UserAgentProvider({
  userAgent,
  children,
}: {
  userAgent: string | null;
  children: ReactNode;
}) {
  const isMobileUA = Boolean(
    userAgent?.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    ),
  );

  return (
    <UserAgentContext.Provider value={{ isMobileUA }}>
      {children}
    </UserAgentContext.Provider>
  );
}
