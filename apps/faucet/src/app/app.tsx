import { lazy, ReactElement, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFoundPage, PendingPage } from '@haqq/ui-kit';
import { Header, Page } from '@haqq/shell/ui-kit';

const Faucet = lazy(() => {
  return import('../components/Faucet');
});

export function App(): ReactElement {
  return (
    <Page header={<Header />}>
      <div className="flex flex-1 flex-col space-y-10 py-10">
        <Suspense fallback={<PendingPage />}>
          <Routes>
            <Route index element={<Faucet />} />

            <Route path="not-found" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Page>
  );
}
