import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { AppWrapper, App } from './app/app';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </StrictMode>,
);
