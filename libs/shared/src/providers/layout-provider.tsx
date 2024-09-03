'use client';
import { createContext, PropsWithChildren, useContext } from 'react';

export interface ILayoutContext {
  isMobileUA: boolean;
}

const LayoutContext = createContext<ILayoutContext | null>(null);

export function useLayout() {
  const layoutContext = useContext(LayoutContext);

  if (!layoutContext) {
    throw new Error(
      'useLayout should be used only from child of LayoutProvider',
    );
  }

  return layoutContext;
}

export function LayoutProvider({
  isMobileUA,
  children,
}: PropsWithChildren<ILayoutContext>) {
  return (
    <LayoutContext.Provider value={{ isMobileUA }}>
      {children}
    </LayoutContext.Provider>
  );
}
