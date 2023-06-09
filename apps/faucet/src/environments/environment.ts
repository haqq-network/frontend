// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export const environment = {
  isProduction: false,
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
};
