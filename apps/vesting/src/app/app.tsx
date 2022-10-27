import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { Container, Page } from '../components/Layout/Layout';
import { Spinner } from '../components/Playground/Playground';
import { MainPage } from '../pages/MainPage';
import { NotFoundPage } from '../pages/NotFoundPage';

const AccountPage = lazy(() => import('../pages/AccountPage'));

export function PendingPage() {
  return (
    <Container className="min-h-[400px] py-20 flex items-center justify-center content-center">
      <Spinner />
    </Container>
  );
}

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

          {/* <Route path="deposit">
            <Route
              index
              element={
                <RequireConnectedWallet>
                  <DepositPage />
                </RequireConnectedWallet>
              }
            />
            <Route
              path="withdraw"
              element={
                <RequireConnectedWallet>
                  <WithdrawPage />
                </RequireConnectedWallet>
              }
            />
            <Route
              path="transfer"
              element={
                <RequireConnectedWallet>
                  <TransferPage />
                </RequireConnectedWallet>
              }
            />
          </Route> */}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Page>
  );
}
