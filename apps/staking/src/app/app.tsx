import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFoundPage, PendingPage } from '@haqq/shell-ui-kit';
import { ValidatorListPage } from '@haqq/staking/validator-list-page';
import { ValidatorDetailsPage } from '@haqq/staking/validator-details-page';

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
