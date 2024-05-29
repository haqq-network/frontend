import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { Page } from '../components/Layout/Layout';
import { NotFoundPage } from '../pages/not-found-page';
import { PendingPage } from '../pages/pending-page';

const MainPage = lazy(() => {
  return import('../pages/main-page');
});
const AccountPage = lazy(() => {
  return import('../pages/address-page');
});
const MyAccountPage = lazy(() => {
  return import('../pages/account-page');
});
const SwitchChainPage = lazy(() => {
  return import('../pages/switch-chain-page');
});

export function App() {
  return (
    <Page header={<Header />} footer={<Footer />}>
      <Suspense fallback={<PendingPage />}>
        <Routes>
          <Route index element={<MainPage />} />
          <Route path="account" element={<MyAccountPage />} />
          <Route path="account/:address" element={<AccountPage />} />
          <Route path="switch-network" element={<SwitchChainPage />} />
          <Route path="not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </Suspense>
    </Page>
  );
}
