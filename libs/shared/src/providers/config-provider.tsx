import { createContext, ReactNode, useContext, useMemo } from 'react';

export interface Config {
  chainName: string;
  isStandalone: boolean;
}

export const EnvironmentConfigContext = createContext<Config | undefined>(
  undefined,
);

export function useConfig() {
  const environment = useContext(EnvironmentConfigContext);

  if (!environment) {
    throw new Error(
      'useConfig should be used only from child of ConfigProvider',
    );
  }

  return environment;
}

export function ConfigProvider({
  children,
  chainName,
  isStandalone,
}: {
  children: ReactNode;
  chainName: string;
  isStandalone: boolean;
}) {
  const memoizedEnvironment = useMemo(() => {
    return { chainName, isStandalone };
  }, [chainName, isStandalone]);

  return (
    <EnvironmentConfigContext.Provider value={memoizedEnvironment}>
      {children}
    </EnvironmentConfigContext.Provider>
  );
}
