import {
  ComponentType,
  Fragment,
  lazy,
  ReactElement,
  ReactNode,
  Suspense,
} from 'react';
import { Route, Routes } from 'react-router-dom';
import { Container, Header, Page, PulseLoader } from '@haqq/ui-kit';
import { ValidatorsPage } from './pages/validators';
import { ValidatorDetailsPage } from './pages/validator-details';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeButton } from '@haqq/theme';
import { Toaster } from 'react-hot-toast';

function DevTools() {
  return (
    <Fragment>
      <ReactQueryDevtools />
    </Fragment>
  );
}

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <Page header={<Header rightSlot={<ThemeButton />} />}>{children}</Page>
  );
}

function PendingPage() {
  return (
    <Container className="min-h-[400px] py-20 flex items-center justify-center content-center">
      <PulseLoader />
    </Container>
  );
}

function NotFoundPage() {
  return (
    <Container className="min-h-[400px] py-16 flex flex-col items-center justify-center content-center">
      <h1 className="block text-bold text-6xl">404</h1>
      <h2 className="block text-medium text-3xl">Page not found</h2>
    </Container>
  );
}

export function App() {
  return (
    <Fragment>
      <div className="flex-1 flex flex-col space-y-10 py-10">
        <Suspense fallback={<PendingPage />}>
          <Routes>
            <Route path="/" element={<ValidatorsPage />} />
            <Route
              path="validator/:address"
              element={<ValidatorDetailsPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>

      <Toaster />
      <DevTools />
    </Fragment>
  );
}
