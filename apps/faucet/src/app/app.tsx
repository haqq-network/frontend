import { lazy, ReactElement, Suspense } from 'react';
import { Footer } from '../components/Footer';
import { Route, Routes } from 'react-router-dom';
import { Header, NotFoundPage, Page, PendingPage } from '@haqq/ui-kit';
import { ThemeButton } from '@haqq/theme';

const Faucet = lazy(() => {
  return import('../components/Faucet');
});

export function App(): ReactElement {
  return (
    <Page header={<Header rightSlot={<ThemeButton />} />} footer={<Footer />}>
      <div className="flex-1 flex flex-col space-y-10 py-10">
        <Suspense fallback={<PendingPage />}>
          <Routes>
            <Route index element={<Faucet />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </Page>
  );
}
