export const environment = {
  isProduction: true,
  sentryDsn: process.env['NX_FAUCET_SENTRY_DSN'],
  reCaptchaConfig: {
    siteKey: process.env['NX_FAUCET_RECAPTCHA_SITE_KEY'],
  },
  auth0Config: {
    domain: process.env['NX_FAUCET_AUTH0_DOMAIN'],
    clientId: process.env['NX_FAUCET_AUTH0_CLIENT_ID'],
  },
  serviceConfig: {
    endpoint: process.env['NX_FAUCET_SERVICE_ENDPOINT'],
  },
  walletConnectConfig: {
    projectId: process.env['NX_WALLETCONNECT_PROJECT_ID'],
  },
  commitSha: process.env['GIT_COMMIT_SHA'],
};
