import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFoundPage, Page, PendingPage } from '@haqq/ui-kit';
import { Header } from '@haqq/shell/ui-kit';

const ShellIndexPage = lazy(async () => {
  const { ShellIndexPage } = await import('@haqq/shell/index-page');
  return { default: ShellIndexPage };
});
const StakingApp = lazy(async () => {
  return await import('staking/Module');
});
const GovernanceApp = lazy(async () => {
  return await import('governance/Module');
});

export function App() {
  return (
    <Page header={<Header />}>
      <Suspense fallback={<PendingPage />}>
        <Routes>
          <Route path="/" element={<ShellIndexPage />} />

          <Route path="/staking/*" element={<StakingApp />} />
          <Route path="/governance/*" element={<GovernanceApp />} />

          <Route path="not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </Suspense>
    </Page>
  );
}
