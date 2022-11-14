export const environment = {
  isProduction: false,
  chain: process.env['NX_STAKING_NETWORK'] ?? 'local',
  sentryDsn: process.env['NX_STAKING_SENTRY_DSN'],
};
