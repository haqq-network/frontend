import { lazy, ReactElement, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Header, Page, NotFoundPage, PendingPage } from '@haqq/shell-ui-kit';

const Faucet = lazy(() => {
  return import('../components/Faucet');
});

export function App(): ReactElement {
  const [isBlurred, setBlured] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const offset = 30;
      if (window.scrollY > offset) {
        setBlured(true);
      } else {
        setBlured(false);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Page header={<Header isBlurred={isBlurred} />}>
      <Suspense fallback={<PendingPage />}>
        <Routes>
          <Route index element={<Faucet />} />

          <Route path="not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </Suspense>
    </Page>
  );
}
