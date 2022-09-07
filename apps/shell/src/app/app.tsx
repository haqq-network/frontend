import React, { Suspense } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { Card, Container, Logo, LogoSmall, Page, Spinner } from '@haqq/ui-kit';

const StakingApp = React.lazy(() => import('staking/Module'));
const GovernanceApp = React.lazy(() => import('governance/Module'));

export function Header(): React.ReactElement {
  function getLinkClassName({ isActive }: { isActive: boolean }) {
    return isActive ? 'text-[#04d484]' : '';
  }

  return (
    <header className="backdrop-filter backdrop-blur transform-gpu bg-white/70 border-slate-400/10 border-b">
      <Container>
        <div className="relative flex items-center justify-between h-[64px]">
          <div className="flex-1 flex items-center justify-start space-x-12">
            <NavLink to="/" className="text-[#04d484]">
              <Logo className="h-8 w-auto hidden sm:block" />
              <LogoSmall className="h-10 w-auto block sm:hidden" />
            </NavLink>
          </div>

          <div className="flex flex-row space-x-5 font-medium">
            <NavLink to="/staking" className={getLinkClassName}>
              Staking
            </NavLink>
            <NavLink to="/governance" className={getLinkClassName}>
              Governance
            </NavLink>
          </div>
        </div>
      </Container>
    </header>
  );
}

function PendingPage() {
  return (
    <Container className="min-h-[400px] py-20 flex items-center justify-center content-center">
      <Spinner />
    </Container>
  );
}

export function App() {
  return (
    <Page header={<Header />}>
      <Suspense fallback={<PendingPage />}>
        <Routes>
          <Route
            path="/"
            element={
              <Container className="py-10">
                <Card>
                  <h1 className="font-medium text-4xl leading-relaxed text-center">
                    Hello there{' '}
                    <span role="img" aria-label="waves">
                      👋
                    </span>
                  </h1>
                </Card>
              </Container>
            }
          />

          <Route path="/staking" element={<StakingApp />} />
          <Route path="/governance" element={<GovernanceApp />} />
        </Routes>
      </Suspense>
    </Page>
  );
}

export default App;
