export const environment = {
  isProduction: true,
  chainName: process.env['NX_NETWORK'] ?? 'testedge2',
  sentryDsn: process.env['NX_STAKING_SENTRY_DSN'],
};
