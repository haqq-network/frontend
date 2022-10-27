export const environment = {
  isProduction: true,
  chain: process.env['NX_VESTING_NETWORK'] ?? 'test2',
  contractAddress: process.env['NX_VESTING_CONTRACT_ADDRESS'],
  sentryDsn: process.env['NX_VESTING_SENTRY_DSN'],
};
