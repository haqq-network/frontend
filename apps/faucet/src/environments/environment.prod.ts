export const environment = {
  isProduction: true,
  chain: process.env['NX_FAUCET_NETWORK'] ?? 'test2',
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
};
