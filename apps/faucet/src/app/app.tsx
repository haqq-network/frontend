import React, { lazy, ReactElement, Suspense } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import styled from '@emotion/styled';
import { Container, Spinner } from '../components/Components';
import { useTheme } from '../components/ThemeContainer';

const AppContainer = styled('div')<{ isDark: boolean }>`
  --app-bg-gradient: radial-gradient(
      120% 120% at 5% 5%,
      rgba(91, 171, 205, 0.45) 0%,
      rgba(91, 171, 205, 0.5) 0.01%,
      rgba(54, 54, 54, 0) 70%
    ),
    radial-gradient(
      90% 70% at 96% 95%,
      rgba(91, 171, 205, 0.45) 0%,
      rgba(91, 171, 205, 0.52) 0.01%,
      rgba(54, 54, 54, 0) 80%
    );
  --app-dark-bg-gradient: radial-gradient(
      120% 120% at 4% 5%,
      rgba(91, 171, 205, 0.25) 0%,
      rgba(91, 171, 205, 0.15) 0.01%,
      rgba(54, 54, 54, 0) 60%
    ),
    radial-gradient(
      120% 90% at 95% 90%,
      rgba(91, 171, 205, 0.25) 0%,
      rgba(91, 171, 205, 0.17) 0.01%,
      rgba(54, 54, 54, 0) 80%
    );

  width: 100%;
  height: 100vh;
  position: relative;
  overflow: auto;
  user-select: none;

  background: ${({ isDark }) => {
    return isDark ? 'var(--app-dark-bg-gradient)' : 'var(--app-bg-gradient)';
  }};
`;

const Faucet = lazy(() => import('../components/Faucet'));

export function PendingPage() {
  return (
    <Container className="min-h-[400px] py-16 flex items-center justify-center content-center">
      <Spinner />
    </Container>
  );
}

function NotFound() {
  return (
    <Container className="min-h-[400px] py-16 flex flex-col items-center justify-center content-center">
      <h1 className="block text-bold text-6xl">404</h1>
      <h2 className="block text-medium text-3xl">Page not found</h2>
    </Container>
  );
}

export function App(): ReactElement {
  const { isDark } = useTheme();

  return (
    <BrowserRouter>
      <AppContainer
        className="flex flex-col dark:text-[#fff] dark:bg-[#0c0c0c] text-[#0c0c0c] bg-[#fff]"
        isDark={isDark}
      >
        <Header />
        <div className="flex-1">
          <Suspense fallback={<PendingPage />}>
            <Routes>
              <Route index element={<Faucet />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </AppContainer>
    </BrowserRouter>
  );
}
