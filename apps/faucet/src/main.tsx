import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { environment } from './environments/environment';
import { App } from './app/app';
import { AppContainer } from './app/app-container';
import './index.css';

if (process.env['NODE_ENV'] === 'production') {
  const sentryDsn = environment.sentryDsn;
  if (sentryDsn && sentryDsn !== '') {
    import('@haqq/sentry').then(({ initSentry }) => {
      initSentry(sentryDsn);
    });
  } else {
    console.warn(
      'NX_FAUCET_SENTRY_DSN is undefined. Sentry is not initialized. Check environments variables',
    );
  }
}

function startApp() {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement as HTMLElement);

  root.render(
    <StrictMode>
      <AppContainer>
        <App />
      </AppContainer>
    </StrictMode>,
  );
}

startApp();
