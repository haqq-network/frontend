export const environment = {
  isProduction: true,
  chainName: process.env['NX_NETWORK'] ?? 'testedge2',
  contractAddress: process.env['NX_VESTING_CONTRACT_ADDRESS'],
  sentryDsn: process.env['NX_VESTING_SENTRY_DSN'],
};
