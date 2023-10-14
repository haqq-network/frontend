import { init, BrowserTracing } from '@sentry/react';

export function initSentry(sentryDsn: string, debug = false) {
  init({
    dsn: sentryDsn,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    debug,
  });
}
