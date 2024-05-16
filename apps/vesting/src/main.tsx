import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/app';
import { AppContainer } from './app/app-container';
import './index.css';

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
