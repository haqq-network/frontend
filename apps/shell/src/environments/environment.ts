export const environment = {
  isProduction: false,
  chainName: process.env['NX_NETWORK'] ?? 'testedge2',
  sentryDsn: process.env['NX_SHELL_SENTRY_DSN'],
};
