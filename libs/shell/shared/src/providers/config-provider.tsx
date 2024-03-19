'use client';
import { createContext, ReactNode, useContext, useMemo } from 'react';

export interface Config {
  commitSha: string;
  faucetConfig: {
    serviceEndpoint: string | undefined;
    auth0Domain: string | undefined;
    auth0ClientId: string | undefined;
  };
  reCaptchaConfig: {
    siteKey: string | undefined;
  };
  walletConnectConfig: {
    projectId: string | undefined;
  };
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
  config,
}: {
  children: ReactNode;
  config?: Config;
}) {
  const memoizedEnvironment = useMemo(() => {
    return config;
  }, [config]);

  return (
    <EnvironmentConfigContext.Provider value={memoizedEnvironment}>
      {children}
    </EnvironmentConfigContext.Provider>
  );
}
