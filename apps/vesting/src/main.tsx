import { StrictMode } from 'react';
import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';
import { App } from './app/app';
import { AppProviders } from './providers/app-providers';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

function startApp() {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement as HTMLElement);

  root.render(
    <StrictMode>
      <Sentry.ErrorBoundary
        fallback={<div>Something went wrong. Please try again later.</div>}
      >
        <AppProviders>
          <App />
        </AppProviders>
      </Sentry.ErrorBoundary>
    </StrictMode>,
  );
}

startApp();
