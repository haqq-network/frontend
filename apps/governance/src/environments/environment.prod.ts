export const environment = {
  isProduction: false,
  sentryDsn: process.env['NX_GOVERNANCE_SENTRY_DSN'],
  walletConnectProjectId: process.env['NX_WALLETCONNECT_PROJECT_ID'],
  commitSha: process.env['GIT_COMMIT_SHA'],
};
