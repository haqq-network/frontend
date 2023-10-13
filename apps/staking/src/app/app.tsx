import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFoundPage, PendingPage } from '@haqq/shell-ui-kit';

const ValidatorListPage = lazy(async () => {
  const { ValidatorListPage } = await import(
    '@haqq/staking/validator-list-page'
  );
  return { default: ValidatorListPage };
});
const ValidatorDetailsPage = lazy(async () => {
  const { ValidatorDetailsPage } = await import(
    '@haqq/staking/validator-details-page'
  );
  return { default: ValidatorDetailsPage };
});

export function App() {
  return (
    <Suspense fallback={<PendingPage />}>
      <Routes>
        <Route path="/" element={<ValidatorListPage />} />
        <Route path="validator/:address" element={<ValidatorDetailsPage />} />

        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
}
