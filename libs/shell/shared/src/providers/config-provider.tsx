import { createContext, ReactNode, useContext, useMemo } from 'react';

export interface Config {
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
  isStandalone = false,
}: {
  children: ReactNode;
  isStandalone?: boolean;
}) {
  const memoizedEnvironment = useMemo(() => {
    return { isStandalone };
  }, [isStandalone]);

  return (
    <EnvironmentConfigContext.Provider value={memoizedEnvironment}>
      {children}
    </EnvironmentConfigContext.Provider>
  );
}
