// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export const environment = {
  isProduction: false,
  chain: process.env['NX_NETWORK'] ?? 'testedge2',
  contractAddress: process.env['NX_VESTING_CONTRACT_ADDRESS'],
  sentryDsn: process.env['NX_VESTING_SENTRY_DSN'],
};
