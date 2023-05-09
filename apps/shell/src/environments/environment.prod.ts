export const environment = {
  isProduction: true,
  chainName: process.env['NX_NETWORK'] ?? 'testedge2',
  sentryDsn: process.env['NX_SHELL_SENTRY_DSN'],
  walletConnectProjectId: process.env['NX_WALLETCONNECT_PROJECT_ID'],
};
