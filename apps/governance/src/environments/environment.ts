export const environment = {
  isProduction: false,
  chain: process.env['NX_GOVERNANCE_NETWORK'] ?? 'dev',
  sentryDsn: process.env['NX_GOVERNANCE_SENTRY_DSN'],
};
