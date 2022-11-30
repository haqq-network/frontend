import { createContext, ReactNode, useContext, useMemo } from 'react';

interface Config {
  chainName: string;
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
}: {
  children: ReactNode;
  chainName: string;
}) {
  const memoizedEnvironment = useMemo(() => {
    return { chainName };
  }, [chainName]);

  return (
    <EnvironmentConfigContext.Provider value={memoizedEnvironment}>
      {children}
    </EnvironmentConfigContext.Provider>
  );
}
