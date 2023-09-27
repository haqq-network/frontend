import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFoundPage, PendingPage } from '@haqq/shell-ui-kit';
import { AirdropEvmPage } from './airdrop-evm';

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

export function App() {
  return (
    <Suspense fallback={<PendingPage />}>
      <Routes>
        <Route path="/" element={<ShellIndexPage />} />

        <Route path="/staking/*" element={<StakingApp />} />
        <Route path="/governance/*" element={<GovernanceApp />} />
        <Route path="/airdrop" element={<AirdropEvmPage />} />

        <Route path="/authz" element={<ShellAuthzPage />} />

        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
}
