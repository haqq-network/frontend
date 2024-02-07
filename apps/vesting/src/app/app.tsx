import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAccount, useNetwork } from 'wagmi';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { Page } from '../components/Layout/Layout';
import { MainPage } from '../pages/MainPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PendingPage } from '../pages/PendingPage';

const MyAccountPage = lazy(() => {
  return import('../pages/MyAccountPage');
});
const AccountPage = lazy(() => {
  return import('../pages/AccountPage');
});

function GoToMainPageWhenDisconnect({ children }: { children: JSX.Element }) {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  if (!isConnected) {
    return <Navigate to="/" />;
  }

  if (!chain || (chain && chain.unsupported)) {
    return <Navigate to="/" />;
  }

  return children;
}

function GoToMyAccountWhenConnected({ children }: { children: JSX.Element }) {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  if (isConnected && !(chain && chain.unsupported)) {
    return <Navigate to="/account" />;
  }

  return children;
}

export function App() {
  return (
    <Page header={<Header />} footer={<Footer />}>
      <Suspense fallback={<PendingPage />}>
        <Routes>
          <Route
            index
            element={
              <GoToMyAccountWhenConnected>
                <MainPage />
              </GoToMyAccountWhenConnected>
            }
          />

          <Route
            path="account"
            element={
              <GoToMainPageWhenDisconnect>
                <MyAccountPage />
              </GoToMainPageWhenDisconnect>
            }
          />

          <Route path="account/:address" element={<AccountPage />} />

          <Route path="not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </Suspense>
    </Page>
  );
}
