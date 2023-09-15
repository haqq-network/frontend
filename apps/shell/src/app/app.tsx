import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFoundPage, PendingPage } from '@haqq/shell-ui-kit';

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
const ShellAuthzPage = lazy(async () => {
  const { ShellAuthzPage } = await import('@haqq/shell/authz-page');
  return { default: ShellAuthzPage };
});
const ShellSBTPage = lazy(async () => {
  const { ShellSBTPage } = await import('@haqq/shell/sbt-page');
  return { default: ShellSBTPage };
});

export function App() {
  return (
    <Suspense fallback={<PendingPage />}>
      <Routes>
        <Route path="/" element={<ShellIndexPage />} />

        <Route path="/staking/*" element={<StakingApp />} />
        <Route path="/governance/*" element={<GovernanceApp />} />

        <Route path="/authz" element={<ShellAuthzPage />} />
        <Route path="/sbt" element={<ShellSBTPage />} />

        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
}
