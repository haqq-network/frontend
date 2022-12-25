import { createRoot } from 'react-dom/client';
import { App } from './app/app';
import { environment } from './environments/environment';
import { AppProviders, createTendermintClient } from '@haqq/shared';
import { AppWrapper } from './app/app-wrapper';
import './index.css';

if (process.env['NODE_ENV'] === 'production') {
  const sentryDsn = environment.sentryDsn;
  if (sentryDsn && sentryDsn !== '') {
    import('@haqq/sentry').then(({ initSentry }) => {
      initSentry(sentryDsn);
    });
  } else {
    console.warn(
      'NX_GOVERNANCE_SENTRY_DSN is undefined. Sentry is not initialized. Check environments variables',
    );
  }
}

async function startApp() {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement as HTMLElement);
  const tendermintClient = await createTendermintClient({
    chainName: environment.chainName,
  });

  root.render(
    <AppProviders
      tendermintClient={tendermintClient}
      chainName={environment.chainName}
    >
      <AppWrapper>
        <App />
      </AppWrapper>
    </AppProviders>,
  );
}

startApp();
