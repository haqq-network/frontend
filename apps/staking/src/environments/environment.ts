const commitSha = process.env['NX_COMMIT_SHA'];

export const environment = {
  isProduction: false,
  chain: process.env['NX_STAKING_NETWORK'] ?? 'local',
  sentryDsn: process.env['NX_STAKING_SENTRY_DSN'],
  version: commitSha && commitSha !== '' ? commitSha.slice(0, 7) : 'dev',
};
