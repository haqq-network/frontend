import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFoundPage, PendingPage } from '@haqq/ui-kit';

const StakingValidatorDetails = lazy(async () => {
  const { StakingValidatorDetails } = await import(
    '@haqq/staking/validator-details'
  );
  return { default: StakingValidatorDetails };
});
const StakingValidatorList = lazy(async () => {
  const { StakingValidatorList } = await import('@haqq/staking/validator-list');
  return { default: StakingValidatorList };
});

export function App() {
  return (
    <Suspense fallback={<PendingPage />}>
      <Routes>
        <Route path="/" element={<StakingValidatorList />} />
        <Route
          path="validator/:address"
          element={<StakingValidatorDetails />}
        />

        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
}
