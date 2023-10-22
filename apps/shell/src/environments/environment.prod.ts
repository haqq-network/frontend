export const environment = {
  isProduction: true,
  sentryDsn: process.env['NX_SHELL_SENTRY_DSN'],
  walletConnectProjectId: process.env['NX_WALLETCONNECT_PROJECT_ID'],
  turnstileSiteKey: process.env['NX_TURNSTILE_SITEKEY'],
  airdropEndpoint: process.env['NX_AIRDROP_ENDPOINT'],
  commitSha: process.env['GIT_COMMIT_SHA'],
};
