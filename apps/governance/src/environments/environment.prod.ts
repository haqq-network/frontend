export const environment = {
  isProduction: false,
  chain: process.env['NX_GOVERNANCE_NETWORK'] ?? 'test2',
  sentryDsn: process.env['NX_GOVERNANCE_SENTRY_DSN'],
};
