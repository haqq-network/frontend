import { createRoot } from 'react-dom/client';
import { AppProviders } from '@haqq/shared';
import { App } from './app/app';
import { environment } from './environments/environment';
import { AppWrapper } from './app/app-wrapper';
import './index.css';

if (environment.isProduction) {
  const sentryDsn = environment.sentryDsn;
  if (sentryDsn && sentryDsn !== '') {
    import('@haqq/sentry').then(({ initSentry }) => {
      initSentry(sentryDsn);
    });
  } else {
    console.warn(
      'NX_SHELL_SENTRY_DSN is undefined. Sentry is not initialized. Check environments variables',
    );
  }
}

async function startApp() {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement as HTMLElement);

  root.render(
    <AppProviders
      withReactQueryDevtools={!environment.isProduction}
      walletConnectProjectId={environment.walletConnectProjectId}
      isProduction={environment.isProduction}
    >
      <AppWrapper>
        <App />
      </AppWrapper>
    </AppProviders>,
  );
}

startApp();
