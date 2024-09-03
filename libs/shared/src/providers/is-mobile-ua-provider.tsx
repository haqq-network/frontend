'use client';
import { createContext, ReactNode, useContext } from 'react';

export const IsMobileUAContext = createContext(false);

export function IsMobileUAProvider({
  isMobileUA,
  children,
}: {
  isMobileUA: boolean;
  children: ReactNode;
}) {
  return (
    <IsMobileUAContext.Provider value={isMobileUA}>
      {children}
    </IsMobileUAContext.Provider>
  );
}

export function useIsMobileUA() {
  const isMobileUA = useContext(IsMobileUAContext);

  return isMobileUA;
}
