import { StrictMode } from 'react';
import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';
import { App } from './app/app';
import { AppProviders } from './providers/app-providers';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 0.15,
  replaysSessionSampleRate: 0.05,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
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
