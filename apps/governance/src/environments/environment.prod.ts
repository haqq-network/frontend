export const environment = {
  isProduction: false,
  chainName: process.env['NX_NETWORK'] ?? 'testedge2',
  sentryDsn: process.env['NX_GOVERNANCE_SENTRY_DSN'],
  walletConnectProjectId: process.env['NX_WALLETCONNECT_PROJECT_ID'],
};
