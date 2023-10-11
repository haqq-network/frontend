import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFoundPage, PendingPage } from '@haqq/shell-ui-kit';
import { environment } from '../environments/environment';

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
const AirdropPage = lazy(async () => {
  const { AirdropPage } = await import('@haqq/shell-airdrop');
  return { default: AirdropPage };
});

export function App() {
  return (
    <Suspense fallback={<PendingPage />}>
      <Routes>
        <Route path="/" element={<ShellIndexPage />} />

        <Route path="/staking/*" element={<StakingApp />} />
        <Route path="/governance/*" element={<GovernanceApp />} />
        <Route path="/authz" element={<ShellAuthzPage />} />
        <Route
          path="/airdrop"
          element={
            <AirdropPage
              turnstileSiteKey={environment.turnstileSiteKey}
              airdropEndpoint={environment.airdropEndpoint}
            />
          }
        />

        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
}
