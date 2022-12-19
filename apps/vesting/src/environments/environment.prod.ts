export const environment = {
  isProduction: true,
  chainName: process.env['NX_NETWORK'] ?? 'mainnet',
  contractAddress:
    process.env['NX_VESTING_CONTRACT_ADDRESS'] ??
    '0x1ba8624B418BFfaA93c369B0841204a9d50fA4D5',
  sentryDsn: process.env['NX_VESTING_SENTRY_DSN'],
};
