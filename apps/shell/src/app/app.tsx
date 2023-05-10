import { Fragment, lazy, Suspense, useMemo, useState } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import {
  Button2,
  NotFoundPage,
  Page,
  PendingPage,
  BurgerButton,
} from '@haqq/ui-kit';
import { useBalance } from 'wagmi';
import clsx from 'clsx';
import {
  AccountButton,
  SelectWalletModal,
  ThemeButton,
  useAddress,
  useWallet,
} from '@haqq/shared';
import ScrollLock from 'react-scrolllock';
import { Header } from '@haqq/shell/ui-kit';

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
  const [isOpen, setOpen] = useState(false);
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
      <div className="lg:flex hidden flex-row items-center space-x-5">
        <NavLink to="/staking" className={getLinkClassName}>
          Staking
        </NavLink>
        <NavLink to="/governance" className={getLinkClassName}>
          Governance
        </NavLink>

        {ethAddress ? (
          <AccountButton
            balance={balance}
            address={ethAddress}
            onDisconnectClick={disconnect}
          />
        ) : (
          <Button2 onClick={openSelectWallet}>Connect wallet</Button2>
        )}
      </div>

      <BurgerButton
        className="block lg:hidden"
        isOpen={isOpen}
        onClick={() => {
          setOpen(!isOpen);
        }}
      />

      <SelectWalletModal
        isOpen={isSelectWalletOpen}
        onClose={closeSelectWallet}
      />

      {isOpen && (
        <Fragment>
          <ScrollLock isActive />
          <div className="backdrop-blur transform-gpu fixed lg:hidden w-full top-[64px] h-[calc(100vh-64px)] right-0 z-50 px-[24px] py-[32px] overflow-y-auto bg-white dark:bg-[#0c0c0c]">
            <div className="flex flex-col gap-5">
              <div>
                <NavLink to="/staking" className={getLinkClassName}>
                  Staking
                </NavLink>
              </div>
              <div>
                <NavLink to="/governance" className={getLinkClassName}>
                  Governance
                </NavLink>
              </div>

              <div>
                {ethAddress ? (
                  <AccountButton
                    balance={balance}
                    address={ethAddress}
                    onDisconnectClick={disconnect}
                  />
                ) : (
                  <Button2 onClick={openSelectWallet}>Connect wallet</Button2>
                )}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export function App() {
  return (
    <Page header={<Header />}>
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
