import { createRoot } from 'react-dom/client';
import { App } from './app/app';
import { environment } from './environments/environment';
import { AppProviders } from '@haqq/shared';
import { AppWrapper } from './app/app-wrapper';
import './index.css';

if (process.env['VERCEL_ENV'] === 'production') {
  if (environment.sentryDsn && environment.sentryDsn !== '') {
    const dsn = environment.sentryDsn;

    import('@haqq/sentry').then(({ initSentry }) => {
      initSentry(dsn);
    });
  } else {
    console.warn(
      'NX_GOVERNANCE_SENTRY_DSN is undefined. Sentry is not initialized. Check environments variables',
    );
  }
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement as HTMLElement);

root.render(
  <AppProviders
    walletConnectProjectId={environment.walletConnectProjectId}
    withReactQueryDevtools={!environment.isProduction}
    isStandalone
  >
    <AppWrapper>
      <App />
    </AppWrapper>
  </AppProviders>,
);
