// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export const environment = {
  isProduction: false,
  chainName: process.env['NX_NETWORK'] ?? 'mainnet',
  contractAddress: process.env['NX_VESTING_CONTRACT_ADDRESS'],
  sentryDsn: process.env['NX_VESTING_SENTRY_DSN'],
  walletConnectProjectId: process.env['NX_WALLETCONNECT_PROJECT_ID'],
};
