import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/app';
import { AppProviders } from './providers/app-providers';

function startApp() {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement as HTMLElement);

  root.render(
    <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </StrictMode>,
  );
}

startApp();
