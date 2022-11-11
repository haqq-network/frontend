import { createRoot } from 'react-dom/client';
import { AppContainer } from './app/app-container';
import { App, AppWrapper } from './app/app';
import { environment } from './environments/environment';
import { createTendermintClient } from './providers/cosmos-provider';
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
  const tendermintClient = await createTendermintClient();

  root.render(
    <AppContainer tendermintClient={tendermintClient}>
      <AppWrapper>
        <App />
      </AppWrapper>
    </AppContainer>,
  );
}

startApp();
