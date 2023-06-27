export const environment = {
  isProduction: true,
  contractAddress: process.env['NX_VESTING_CONTRACT_ADDRESS'],
  sentryDsn: process.env['NX_VESTING_SENTRY_DSN'],
  walletConnectProjectId: process.env['NX_WALLETCONNECT_PROJECT_ID'],
};
