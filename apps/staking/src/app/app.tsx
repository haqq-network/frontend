import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFoundPage, PendingPage } from '@haqq/ui-kit';

const ValidatorDetailsPage = lazy(async () => {
  const { ValidatorDetailsPage } = await import('./pages/validator-details');
  return { default: ValidatorDetailsPage };
});
const ValidatorsPage = lazy(async () => {
  const { ValidatorsPage } = await import('./pages/validators');
  return { default: ValidatorsPage };
});

export function App() {
  return (
    <div className="flex-1 flex flex-col space-y-10 py-10">
      <Suspense fallback={<PendingPage />}>
        <Routes>
          <Route path="/" element={<ValidatorsPage />} />
          <Route path="validator/:address" element={<ValidatorDetailsPage />} />

          <Route path="not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
