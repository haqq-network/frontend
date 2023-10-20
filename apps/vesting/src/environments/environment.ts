// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export const environment = {
  isProduction: false,
  sentryDsn: process.env['NX_VESTING_SENTRY_DSN'],
  walletConnectProjectId: process.env['NX_WALLETCONNECT_PROJECT_ID'],
  commitSha: process.env['GIT_COMMIT_SHA'],
  indexerEndpoint: process.env['INDEXER_ENDPOINT'],
};
