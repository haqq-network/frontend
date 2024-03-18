import { init, browserTracingIntegration } from '@sentry/react';

export function initSentry(sentryDsn: string, debug = false) {
  init({
    dsn: sentryDsn,
    integrations: [browserTracingIntegration()],
    tracesSampleRate: 1.0,
    debug,
  });
}
