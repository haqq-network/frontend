import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFoundPage, PendingPage } from '@haqq/shell-ui-kit';
import { environment } from '../environments/environment';

const ShellIndexPage = lazy(async () => {
  const { ShellIndexPage } = await import('@haqq/shell/index-page');
  return { default: ShellIndexPage };
});
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
const ProposalListPage = lazy(async () => {
  const { ProposalList } = await import('@haqq/governance/proposal-list');
  return { default: ProposalList };
});
const ProposalDetailsPage = lazy(async () => {
  const { ProposalDetails } = await import('@haqq/governance/proposal-details');
  return { default: ProposalDetails };
});
const ShellAuthzPage = lazy(async () => {
  const { ShellAuthzPage } = await import('@haqq/shell/authz-page');
  return { default: ShellAuthzPage };
});
const AirdropPage = lazy(async () => {
  const { AirdropPage } = await import('@haqq/shell-airdrop');
  return { default: AirdropPage };
});
const WalletCheckPage = lazy(async () => {
  const { WalletCheckPage } = await import('@haqq/shell-airdrop');
  return { default: WalletCheckPage };
});

export function App() {
  return (
    <Suspense fallback={<PendingPage />}>
      <Routes>
        <Route path="/" element={<ShellIndexPage />} />

        <Route
          path="/staking/*"
          element={
            <Routes>
              <Route path="/" element={<ValidatorListPage />} />
              <Route
                path="validator/:address"
                element={<ValidatorDetailsPage />}
              />
            </Routes>
          }
        />
        <Route
          path="/governance/*"
          element={
            <Routes>
              <Route path="/" element={<ProposalListPage />} />
              <Route path="proposal/:id" element={<ProposalDetailsPage />} />
            </Routes>
          }
        />
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
        <Route
          path="/airdrop/check-wallet"
          element={
            <WalletCheckPage
              turnstileSiteKey={environment.turnstileSiteKey}
              walletCheckEndpoint={environment.airdropEndpoint}
            />
          }
        />

        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
}
