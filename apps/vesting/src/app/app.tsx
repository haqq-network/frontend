import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { PendingPage } from '@haqq/ui-kit';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { MainPage } from '../pages/MainPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { Page } from '../components/Layout/Layout';

const AccountPage = lazy(() => {
  return import('../pages/AccountPage');
});

function RequireConnectedWallet({ children }: { children: JSX.Element }) {
  const { isConnected } = useAccount();
  const location = useLocation();

  if (!isConnected) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export function App() {
  return (
    <Page header={<Header />} footer={<Footer />}>
      <Suspense fallback={<PendingPage />}>
        <Routes>
          <Route index element={<MainPage />} />

          <Route
            path="account"
            element={
              <RequireConnectedWallet>
                <AccountPage />
              </RequireConnectedWallet>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Page>
  );
}
