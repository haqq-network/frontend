import { createRoot } from 'react-dom/client';
import { createTendermintClient } from './app/providers/cosmos-provider';
import { AppContainer } from './app/app-container';
import { App, AppWrapper } from './app/app';
import { environment } from './environments/environment';
import './index.css';

if (process.env['NODE_ENV'] === 'production') {
  if (environment.sentryDsn && environment.sentryDsn !== '') {
    const dsn = environment.sentryDsn;
    import('@haqq/sentry').then(({ initSentry }) => {
      initSentry(dsn);
    });
  } else {
    console.warn(
      'NX_STAKING_SENTRY_DSN is undefined. Sentry is not initialized. Check environments variables',
    );
  }
}

async function startApp() {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement as HTMLElement);
  const tendermintClient = await createTendermintClient();

  root.render(
    <AppContainer tendermintClient={tendermintClient}>
      <AppWrapper>
        <App />
      </AppWrapper>
    </AppContainer>,
  );
}

console.info(`start staking app version: ${environment.version}`);
startApp();
