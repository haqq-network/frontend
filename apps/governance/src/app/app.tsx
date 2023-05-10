import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFoundPage, PendingPage } from '@haqq/ui-kit';

const ProposalListPage = lazy(async () => {
  const { ProposalList } = await import('@haqq/governance/proposal-list');
  return { default: ProposalList };
});
const ProposalDetailsPage = lazy(async () => {
  const { ProposalDetails } = await import('@haqq/governance/proposal-details');
  return { default: ProposalDetails };
});

export function App() {
  return (
    <Suspense fallback={<PendingPage />}>
      <Routes>
        <Route path="/" element={<ProposalListPage />} />
        <Route path="proposal/:id" element={<ProposalDetailsPage />} />

        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
}
