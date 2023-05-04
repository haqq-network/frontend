import { Fragment, lazy, Suspense, useMemo } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { Button2, Header, NotFoundPage, Page, PendingPage } from '@haqq/ui-kit';
import { useBalance } from 'wagmi';
import clsx from 'clsx';
import {
  AccountButton,
  SelectWalletModal,
  ThemeButton,
  useAddress,
  useWallet,
} from '@haqq/shared';

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

function HeaderButtons() {
  const {
    disconnect,
    openSelectWallet,
    isSelectWalletOpen,
    closeSelectWallet,
  } = useWallet();
  const { ethAddress } = useAddress();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    watch: true,
  });
  const balance = useMemo(() => {
    if (!balanceData) {
      return undefined;
    }

    return {
      symbol: balanceData.symbol,
      value: Number.parseFloat(balanceData.formatted),
    };
  }, [balanceData]);

  function getLinkClassName({ isActive }: { isActive: boolean }) {
    return clsx(
      'text-slate-500 hover:text-slate-400 font-semibold',
      isActive && 'text-haqq-primary-500',
    );
  }

  return (
    <Fragment>
      <div className="flex flex-row space-x-5 mr-5">
        <NavLink to="/staking" className={getLinkClassName}>
          Staking
        </NavLink>
        <NavLink to="/governance" className={getLinkClassName}>
          Governance
        </NavLink>
      </div>

      {ethAddress ? (
        <AccountButton
          balance={balance}
          address={ethAddress}
          onDisconnectClick={disconnect}
        />
      ) : (
        <Button2 onClick={openSelectWallet}>Connect wallet</Button2>
      )}

      <div className="inline-block">
        <ThemeButton />
      </div>

      <SelectWalletModal
        isOpen={isSelectWalletOpen}
        onClose={closeSelectWallet}
      />
    </Fragment>
  );
}

export function App() {
  return (
    <Page header={<Header rightSlot={<HeaderButtons />} />}>
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
