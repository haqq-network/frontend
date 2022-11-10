const commitSha = process.env['NX_COMMIT_SHA'];

export const environment = {
  isProduction: true,
  chain: process.env['NX_STAKING_NETWORK'] ?? 'test2',
  sentryDsn: process.env['NX_STAKING_SENTRY_DSN'],
  version: commitSha && commitSha !== '' ? commitSha.slice(0, 7) : 'dev',
};
