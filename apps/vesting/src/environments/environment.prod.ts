export const environment = {
  isProduction: true,
  sentryDsn: process.env['NX_VESTING_SENTRY_DSN'],
  walletConnectProjectId: process.env['NX_WALLETCONNECT_PROJECT_ID'],
  commitSha: process.env['GIT_COMMIT_SHA'],
};
